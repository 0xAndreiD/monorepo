import { AuthenticationError, resolver } from "blitz"
import db, { LinkType } from "db"
import { object, z } from "zod"

export const CreateProductInfoSectionLink = z.object({
  productInfoSectionId: z.number().nonnegative(),
  link: z.object({
    //make new link
    body: z.string().nonempty(),
    href: z.string().nonempty(),
    type: z.nativeEnum(LinkType),
  }),
})

export default resolver.pipe(
  resolver.zod(CreateProductInfoSectionLink),
  resolver.authorize(),
  async ({ productInfoSectionId, link }, ctx) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const userId = ctx.session.userId
    if (!userId) throw new AuthenticationError("no userId provided")

    return await db.productInfoSectionLink.create({
      data: {
        productInfoSection: { connect: { id: productInfoSectionId } },
        link: {
          create: {
            ...link,
            creator: { connect: { id: userId } },
          },
        },
      },
    })
  }
)
