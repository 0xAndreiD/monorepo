import { AuthenticationError, resolver } from "blitz"
import db from "db"
import { z } from "zod"

export const CreateNextStepsTask = z.object({
  portalId: z.number().nonnegative(),
  description: z.string().nonempty(),
})

export default resolver.pipe(
  resolver.zod(CreateNextStepsTask),
  resolver.authorize(),
  // async ({ portalId, description }, ctx) => {
  async ({ portalId, description }, ctx) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const userId = ctx.session.userId
    if (!userId) throw new AuthenticationError("no userId provided")

    return await db.nextStepsTask.create({
      data: {
        portalId,
        description,
        isCompleted: false,
        userId,
      },
    })
  }
)
