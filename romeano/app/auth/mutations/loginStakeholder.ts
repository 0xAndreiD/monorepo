import { AuthenticationError, generateToken, resolver } from "blitz"
import db from "db"
import { z } from "zod"
import { sendPortalLoginLink } from "../../core/util/email"

import { decodeHashId } from "../../core/util/crypto"

export const LoginStakeholder = z.object({
  portalId: z.string(),
  destUrl: z.string().nonempty(),
  email: z.string().email().nonempty(),
})

//for Stakeholder
export default resolver.pipe(resolver.zod(LoginStakeholder), async ({ portalId, destUrl, email }, ctx) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const portal = await db.portal.findUnique({
    where: { id: decodeHashId(portalId) },
    include: {
      vendor: true,
    },
  })
  if (!portal) throw new AuthenticationError("Could not find portal!")

  const userPortal = await db.userPortal.findFirst({
    include: { user: true },
    where: {
      portalId: decodeHashId(portalId),
      user: {
        email: {
          mode: "insensitive",
        },
      },
    },
  })

  if (!userPortal) throw new AuthenticationError("Could not find email address associated to portal!")

  const magicLink = await db.magicLink.create({
    data: {
      id: generateToken(),
      userId: userPortal.userId,
      vendorId: userPortal.vendorId,
      destUrl,
      hasClicked: false,
    },
  })

  sendPortalLoginLink(
    portal.customerName,
    portal.vendor.name,
    userPortal.user.firstName,
    email,
    magicLink.id,
    userPortal.user.firstName
  )

  return magicLink.id //FIXME: dev speed hack, frontend shouldn't get this
})
