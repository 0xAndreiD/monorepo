import { AuthenticationError, resolver } from "blitz"
import db from "db"
import { z } from "zod"

export const CreateProductInfoSectionLink = z.object({
  productInfoSectionId: z.number().nonnegative(),
  linkId: z.number().nonnegative(),
})

export default resolver.pipe(
  resolver.zod(CreateProductInfoSectionLink),
  resolver.authorize(),
  async ({ productInfoSectionId, linkId }, ctx) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const userId = ctx.session.userId
    if (!userId) throw new AuthenticationError("no userId provided")

    return await db.productInfoSectionLink.create({
      data: {
        productInfoSection: { connect: { id: productInfoSectionId } },
        link: {
          connect: {
            id: linkId,
          },
        },
      },
    })
  }
)
