import { AuthenticationError, resolver } from "blitz"
import db, { LinkType } from "db"
import { z } from "zod"

export const UpdateProposalLink = z.object({
  portalId: z.number().nonnegative(),
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
  resolver.zod(UpdateProposalLink),
  resolver.authorize(),
  async ({ portalId, link }, ctx) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const userId = ctx.session.userId
    if (!userId) throw new AuthenticationError("no userId provided")

    switch (typeof link) {
      case "number": //existing link
        return await db.portal.update({
          where: { id: portalId },
          data: {
            proposalLink: { connect: { id: link } },
          },
        })
      default:
        return await db.portal.update({
          where: { id: portalId },
          data: {
            proposalLink: {
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
