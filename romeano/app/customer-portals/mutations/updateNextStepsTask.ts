import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const UpdateNextStepsTask = z.object({
  id: z.number(),
  isCompleted: z.boolean(),
})

export default resolver.pipe(resolver.zod(UpdateNextStepsTask),async ({ id, ...data }) => {
// export default resolver.pipe(resolver.zod(UpdateNextStepsTask), resolver.authorize(), async ({ id, ...data }) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const task = await db.nextStepsTask.update({ where: { id }, data })

  return task
})
