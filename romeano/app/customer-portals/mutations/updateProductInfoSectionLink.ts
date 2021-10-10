import { AuthenticationError, resolver } from "blitz"
import db, { LinkType } from "db"
import { z } from "zod"

export const CreateProductInfoSectionLink = z.object({
  productInfoSectionLinkId: z.number().nonnegative(),
  body: z.string().nonempty(),
  href: z.string().nonempty(),
})

export default resolver.pipe(
  resolver.zod(CreateProductInfoSectionLink),
  resolver.authorize(),
  async ({ productInfoSectionLinkId, body, href }, ctx) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const userId = ctx.session.userId
    if (!userId) throw new AuthenticationError("no userId provided")

    //create new link instead of updating to preserve old history
    return await db.productInfoSectionLink.update({
      where: { id: productInfoSectionLinkId },
      data: {
        link: {
          create: {
            body,
            href,
            type: LinkType.WebLink,
            creator: { connect: { id: userId } },
          },
        },
      },
    })
  }
)
