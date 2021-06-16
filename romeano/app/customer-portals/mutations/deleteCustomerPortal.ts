import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const DeleteCustomerPortal = z.object({
  id: z.number(),
})

export default resolver.pipe(resolver.zod(DeleteCustomerPortal), resolver.authorize(), async ({ id }) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const customerPortal = await db.customerPortal.deleteMany({ where: { id } })

  return customerPortal
})
