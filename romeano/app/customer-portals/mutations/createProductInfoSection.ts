import { AuthenticationError, resolver } from "blitz"
import db from "db"
import { z } from "zod"

export const CreateProductInfoSection = z.object({
  portalId: z.number().nonnegative(),
  heading: z.string(),
})

export default resolver.pipe(
  resolver.zod(CreateProductInfoSection),
  resolver.authorize(),
  async ({ portalId, heading }, ctx) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const userId = ctx.session.userId
    if (!userId) throw new AuthenticationError("no userId provided")

    return await db.productInfoSection.create({
      data: {
        portalId: portalId,
        heading: heading,
      },
    })
  }
)
