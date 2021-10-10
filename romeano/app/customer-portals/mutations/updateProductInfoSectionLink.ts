import { AuthenticationError, resolver } from "blitz"
import db, { LinkType } from "db"
import { z } from "zod"

//create new link instead of updating to preserve old history
export const UpdateProductInfoSectionLink = z.object({
  productInfoSectionLinkId: z.number().nonnegative(),
  link: z.union([
    z.number(), //existing link
    z.object({
      //make new link
      body: z.string().nonempty(),
      href: z.string().nonempty(),
      type: z.nativeEnum(LinkType),
    }),
  ]),
})

export default resolver.pipe(
  resolver.zod(UpdateProductInfoSectionLink),
  resolver.authorize(),
  async ({ productInfoSectionLinkId, link }, ctx) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const userId = ctx.session.userId
    if (!userId) throw new AuthenticationError("no userId provided")

    switch (typeof link) {
      case "number": //existing link
        return await db.productInfoSectionLink.update({
          where: { id: productInfoSectionLinkId },
          data: {
            link: { connect: { id: link } },
          },
        })
      default:
        //new link
        return await db.productInfoSectionLink.update({
          where: { id: productInfoSectionLinkId },
          data: {
            link: {
              create: {
                body: link.body,
                href: link.href,
                type: link.type,
                creator: { connect: { id: userId } },
              },
            },
          },
        })
    }
  }
)
