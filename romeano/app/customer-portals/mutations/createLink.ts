import { AuthenticationError, resolver } from "blitz"
import db, { LinkType } from "db"
import { z } from "zod"

export const CreateLink = z.object({
  portalId: z.number().nonnegative(),
  link: z.object({
    //make new link
    body: z.string().nonempty(),
    href: z.string().nonempty(),
    type: z.nativeEnum(LinkType),
  }),
})

export default resolver.pipe(resolver.zod(CreateLink), resolver.authorize(), async (data, ctx) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const userId = ctx.session.userId
  if (!userId) throw new AuthenticationError("no userId provided")

  return await db.link.create({
    data: {
      body: data.link.body,
      href: data.link.href,
      type: data.link.type,
      creator: { connect: { id: userId } },
    },
  })
})
