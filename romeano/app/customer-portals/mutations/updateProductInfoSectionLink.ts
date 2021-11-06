import { AuthenticationError, resolver } from "blitz"
import db from "db"
import { z } from "zod"

//create new link instead of updating to preserve old history
export const UpdateProductInfoSectionLink = z.object({
  productInfoSectionLinkId: z.number().nonnegative(),
  linkId: z.number().nonnegative(),
})

export default resolver.pipe(
  resolver.zod(UpdateProductInfoSectionLink),
  resolver.authorize(),
  async ({ productInfoSectionLinkId, linkId }, ctx) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const userId = ctx.session.userId
    if (!userId) throw new AuthenticationError("no userId provided")

    return await db.productInfoSectionLink.update({
      where: { id: productInfoSectionLinkId },
      data: {
        link: { connect: { id: linkId } },
      },
    })
  }
)
