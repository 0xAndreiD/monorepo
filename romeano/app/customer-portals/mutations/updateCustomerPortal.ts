import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const UpdateCustomerPortal = z.object({
  id: z.number(),
  name: z.string(),
})

export default resolver.pipe(resolver.zod(UpdateCustomerPortal), resolver.authorize(), async ({ id, ...data }) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const customerPortal = await db.customerPortal.update({ where: { id }, data })

  return customerPortal
})
