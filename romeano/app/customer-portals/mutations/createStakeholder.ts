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
        },
      }))

    const stakeholder =
      (await db.stakeholder.findUnique({ where: { userId: user.id } })) ??
      (await db.stakeholder.create({
        data: {
          jobTitle,
          userId: user.id,
        },
      }))

    try {
      await db.userPortal.create({
        data: {
          portalId: decodeHashId(portalId),
          userId: user.id,
          role: Role.Stakeholder,
        },
      })
    } catch {
      console.log("tree")
    }

    const magicLink = await db.magicLink.create({
      data: {
        id: generateToken(),
        userId: user.id,
        destUrl: Routes.CustomerPortal({ portalId }).pathname.replace("[portalId]", portalId),
        hasClicked: false,
      },
    })

    sendInvite(
      portal.customerName,
      portal.vendor.name,
      userPortal.user.firstName,
      email,
      magicLink.id,
      portal.vendor.logoUrl,
      portal.customerLogoUrl
    )

    return stakeholder
  }
)
