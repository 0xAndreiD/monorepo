import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const UpdateNextStepsTask = z.object({
  id: z.number(),
})

export default resolver.pipe(resolver.zod(UpdateNextStepsTask),async ({ id, ...data }) => {
// export default resolver.pipe(resolver.zod(UpdateNextStepsTask), resolver.authorize(), async ({ id, ...data }) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant

  //TODO FIXME: make sure delete is only for vendor (created by customer)
  return await db.nextStepsTask.delete({ where: { id } })
})
