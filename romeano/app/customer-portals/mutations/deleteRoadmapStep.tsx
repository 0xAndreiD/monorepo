import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const DeleteNextStepsTask = z.object({
  roadmapStageId: z.number().nonnegative(),
})

export default resolver.pipe(
  resolver.zod(DeleteNextStepsTask),
  resolver.authorize(),
  async ({ roadmapStageId, ...data }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant

    //TODO FIXME: make sure delete is only for vendor (created by customer)
    return await db.roadmapStage.delete({ where: { id: roadmapStageId } })
  }
)
