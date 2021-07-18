import { AuthenticationError, resolver } from "blitz"
import db from "db"
import { nanoid } from "nanoid"
import { z } from "zod"
import { sendLoginLink } from "../../core/util/email"

export const Login = z.object({
  portalId: z.number().nonnegative(),
  email: z.string().email().nonempty()
})

export default resolver.pipe(resolver.zod(Login),
  async ({ portalId, email }, ctx) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const portal = await db.portal.findUnique({
      where: { id: portalId },
      include: {
        vendor: true
      }
    })
    if (!portal) throw new AuthenticationError("Could not find portal!")

    const userPortal = await db.userPortal.findFirst({
      include: { user: true },
      where: {
        portalId,
        user: { email }
      }
    })

    if (!userPortal) throw new AuthenticationError("Could not find email address associated to portal!")

    const magicLink = await db.magicLink.create({
      data: {
        id: nanoid(),
        userId: userPortal.userId,
        portalId: portalId,
        hasClicked: false
      }
    })

    sendLoginLink(portal.customerName,
      portal.vendor.name,
      userPortal.user.firstName,
      email,
      magicLink.id
    )

    return magicLink.id
  })
