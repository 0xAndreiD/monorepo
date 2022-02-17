import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const DeleteTemplate = z.object({
  id: z.number(),
})

export default resolver.pipe(resolver.zod(DeleteTemplate), resolver.authorize(), async ({ id, ...data }) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant

  //TODO FIXME: make sure delete is only for vendor (created by customer)
  return await db.template.delete({ where: { id } })
})
