import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const CreateCustomerPortal = z.object({
  name: z.string(),
})

export default resolver.pipe(resolver.zod(CreateCustomerPortal), resolver.authorize(), async (input) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const customerPortal = await db.customerPortal.create({ data: input })

  return customerPortal
})
