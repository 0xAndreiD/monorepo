import { AuthenticationError, resolver } from "blitz"
import db, { LinkType } from "db"
import { z } from "zod"

export const CreateProductInfoSectionLink = z.object({
  productInfoSectionId: z.number().nonnegative(),
  linkId: z.number().optional(),
  body: z.string().nonempty(),
  href: z.string().nonempty(),
})

export default resolver.pipe(
  resolver.zod(CreateProductInfoSectionLink),
  resolver.authorize(),
  async ({ productInfoSectionId, linkId, body, href }, ctx) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const userId = ctx.session.userId
    if (!userId) throw new AuthenticationError("no userId provided")

    //web link case
    if (!linkId) {
      return await db.productInfoSectionLink.create({
        data: {
          productInfoSection: { connect: { id: productInfoSectionId } },
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

    //uploaded file case
    return await db.productInfoSectionLink.create({
      data: {
        productInfoSection: { connect: { id: productInfoSectionId } },
        link: { connect: { id: linkId } },
      },
    })
  }
)
