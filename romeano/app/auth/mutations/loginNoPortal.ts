import { AuthenticationError, generateToken, resolver } from "blitz"
import db from "db"
import { z } from "zod"
import { sendAELoginLink } from "../../core/util/email"

export const LoginNoPortal = z.object({
  email: z.string().email().nonempty()
})

//for AE
export default resolver.pipe(resolver.zod(LoginNoPortal),
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
        userId: userPortal.userId,
        hasClicked: false
      }
    })

    sendAELoginLink(userPortal.user.firstName, email, magicLink.id)
    return magicLink.id
  })
