import { AuthenticationError, resolver } from "blitz"
import db from "db"
import { z } from "zod"

const UpdateTemplate = z.object({
  id: z.number(),
  isPublic: z.boolean(),
})

export default resolver.pipe(resolver.zod(UpdateTemplate), resolver.authorize(), async ({ id, ...data }, ctx) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const userId = ctx.session.userId
  if (!userId) throw new AuthenticationError("No userId found in session")

  //TODO FIXME: make sure delete is only for vendor (created by customer)
  const template = await db.template.findUnique({ where: { id } })
  if (!template) {
    console.log("Template not found", id)
    return
  }
  if (template.vendorId !== ctx.session.vendorId) {
    throw new AuthenticationError("Template is not accessible")
  }
  await db.template.update({
    where: {
      id: id,
    },
    data: {
      isPublic: data.isPublic,
    },
  })
})
