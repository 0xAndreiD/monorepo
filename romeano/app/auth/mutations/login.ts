import { AuthenticationError, generateToken, resolver } from "blitz"
import db from "db"
import { z } from "zod"
import { sendAELoginLink, sendPortalLoginLink } from "../../core/util/email"

export const Login = z.object({
  portalId: z.number().nonnegative(),
  email: z.string().email().nonempty()
})

//for Stakeholder
export default resolver.pipe(resolver.zod(Login),
  async ({ url, email }, ctx) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant

    const user = await db.user.findFirst({
      include: {
        accountExecutive: true,
        stakeholder: true
      },
      where: {
        email
      }
    })

    if (!user) throw new AuthenticationError("Could not find email address associated to portal!")

    const magicLink = await db.magicLink.create({
      data: {
        id: generateToken(),
        userId: user.id,
        url,
        hasClicked: false
      }
    })

    if (user.accountExecutive) {
      sendAELoginLink(user.firstName, email, magicLink.id)
    } else {
      sendPortalLoginLink(user.firstName
          .vendor.name,
        user.firstName,
        email,
        magicLink.id
      )
    }
    return magicLink //TODO: use only in dev!
  })
