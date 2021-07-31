import { AuthenticationError, generateToken, resolver } from "blitz"
import db from "db"
import { z } from "zod"
import { sendAELoginLink } from "../../core/util/email"

export const LoginAE = z.object({
  email: z.string().email().nonempty()
})

//for AE
export default resolver.pipe(resolver.zod(LoginAE),
  async ({ email }, ctx) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant

    const userPortal = await db.userPortal.findFirst({
      include: { user: true },
      where: {
        user: { email }
      },
      orderBy: {
        portalId: "desc"
      }
    })

    if (!userPortal) throw new AuthenticationError("Could not find email address associated to portal!")

    const magicLink = await db.magicLink.create({
      data: {
        id: generateToken(),
        url:
        userId
  :
    userPortal.userId,
  }
  })

    sendAELoginLink(userPortal.user.firstName, email, magicLink.id)
    return magicLink.id
  })
