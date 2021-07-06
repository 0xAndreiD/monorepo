import { AuthenticationError, resolver } from "blitz"
import db, { Role } from "db"
import { z } from "zod"

export const CreateStakeholder = z.object({
  portalId: z.number(),
  email: z.string().email().nonempty(),
  fullName: z.string().nonempty(),
  jobTitle: z.string().nonempty()
})

export default resolver.pipe(resolver.zod(CreateStakeholder),
  resolver.authorize(),
  async ({ portalId, email, fullName, jobTitle }, ctx) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const userId = ctx.session.userId
    if (!userId) throw new AuthenticationError("no userId provided")

    const stakeholder = await db.stakeholder.create({
      data: {
        jobTitle,
        user: {
          create: {
            firstName: fullName.substring(0, fullName.indexOf(" ")),
            lastName: fullName.substring(fullName.indexOf(" ") + 1) ?? "",
            email,
            userPortals: {
              create: {
                portalId,
                role: Role.Stakeholder
              }
            }
          }
        }
      }
    })

    return stakeholder
  })
