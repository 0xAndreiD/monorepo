import { AuthenticationError, resolver } from "blitz"
import db from "db"
import { z } from "zod"

export const UpdateLaunchRoadmapStageTask = z.object({
  portalId: z.number(),
  roadmapStageTaskId: z.number().nonnegative(),
  task: z.string().nonempty(),
})

export default resolver.pipe(
  resolver.zod(UpdateLaunchRoadmapStageTask),
  resolver.authorize(),
  async ({ portalId, roadmapStageTaskId, task }, ctx) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const userId = ctx.session.userId
    if (!userId) throw new AuthenticationError("no userId provided")

    return await db.roadmapStageTask.update({
      data: { task },
      where: { id: roadmapStageTaskId },
    })
  }
)
