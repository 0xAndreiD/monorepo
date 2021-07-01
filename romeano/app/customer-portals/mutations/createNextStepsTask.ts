import { AuthenticationError, resolver } from "blitz"
import db from "db"
import { z } from "zod"


const CreateNextStepsTask = z.object({
  portalId: z.number(),
  description: z.string().nonempty()
})

export default resolver.pipe(resolver.zod(CreateNextStepsTask),
  resolver.authorize(),
  async ({ portalId, description }, ctx) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const userId = ctx.session.userId
    if (!userId) throw new AuthenticationError("no userId provided")

    const task = await db.nextStepsTask.create({
      data: {
        portalId,
        description,
        isCompleted:false,
        userId
      }
    })

    return task
  })
