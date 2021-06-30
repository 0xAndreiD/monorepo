import { resolver } from "blitz"
import db from "db"
import { z } from "zod"
import { CustomerOrVendor } from "db"


const CreateNextStepsTask = z.object({
  portalId: z.number(),
  description: z.string().nonempty()
})

export default resolver.pipe(resolver.zod(CreateNextStepsTask),
  resolver.authorize(),
  async ({ portalId, description }, ctx) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const task = await db.nextStepsTask.create({
      data: {
        portalId,
        description,
        isCompleted:false,
        customerOrVendor: CustomerOrVendor.VENDOR,
      }
    })

    return task
  })
