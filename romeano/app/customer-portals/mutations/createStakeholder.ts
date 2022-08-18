import { AuthenticationError, generateToken, resolver, Routes } from "blitz"
import db, { Role, SiteRole } from "db"
import { z } from "zod"
import { splitName } from "../../core/util/text"
import { sendInvite } from "../../core/util/email"

import { decodeHashId } from "../../core/util/crypto"

export const CreateStakeholder = z.object({
  portalId: z.string(),
  email: z.string().email().nonempty(),
  fullName: z.string().nonempty(),
  jobTitle: z.string().nonempty(),
})

export default resolver.pipe(
  resolver.zod(CreateStakeholder),
  resolver.authorize(),
  async ({ portalId, email, fullName, jobTitle }, ctx) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const userId = ctx.session.userId
    if (!userId) throw new AuthenticationError("no userId provided")

    const portal = await db.portal.findUnique({
      where: { id: decodeHashId(portalId) },
      include: {
        vendor: true,
      },
    })
    if (!portal) throw new AuthenticationError("Could not find portal!")

    const userPortal = await db.userPortal.findUnique({
      where: {
        userId_portalId: { portalId: decodeHashId(portalId), userId },
      },
      include: {
        user: true,
      },
    })
    if (!userPortal) throw new AuthenticationError("Could not find user in portal!")

    const [firstName, lastName] = splitName(fullName)

    const user =
      (await db.user.findUnique({ where: { email } })) ??
      (await db.user.create({
        data: {
          firstName,
          lastName,
          email,
          role: SiteRole.SiteUser,
          vendorId: ctx.session.vendorId,
        },
      }))

    const stakeholder =
      (await db.stakeholder.findUnique({ where: { userId: user.id } })) ??
      (await db.stakeholder.create({
        data: {
          jobTitle,
          userId: user.id,
          vendorId: ctx.session.vendorId,
        },
      }))

    try {
      ;(await db.userPortal.findFirst({
        where: {
          portalId: decodeHashId(portalId),
          userId: user.id,
        },
      })) ??
        (await db.userPortal.create({
          data: {
            portalId: decodeHashId(portalId),
            vendorId: ctx.session.vendorId,
            userId: user.id,
            role: Role.Stakeholder,
          },
        }))
    } catch (err) {
      console.log("Error while creating user portal", err)
    }

    const magicLink = await db.magicLink.create({
      data: {
        id: generateToken(),
        userId: user.id,
        vendorId: user.vendorId,
        destUrl: Routes.CustomerPortal({ portalId }).pathname.replace("[portalId]", portalId),
        hasClicked: false,
      },
    })

    console.log("Sending invite...")
    sendInvite(
      portal.customerName,
      portal.vendor.name,
      userPortal.user.firstName,
      email,
      magicLink.id,
      portal.customerLogoUrl,
      portal.vendor.logoUrl || ""
    )
    console.log("Invite sent to stakeholder", stakeholder)

    return stakeholder
  }
)
