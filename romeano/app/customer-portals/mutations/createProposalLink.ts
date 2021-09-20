import { AuthenticationError, resolver } from "blitz"
import db, { LinkType } from "db"
import { z } from "zod"

export const CreateProposalLink = z.object({
  portalId: z.number().nonnegative(),
  body: z.string().nonempty(),
  href: z.string().nonempty(),
})

export default resolver.pipe(
  resolver.zod(CreateProposalLink),
  resolver.authorize(),
  async ({ portalId, body, href }, ctx) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const userId = ctx.session.userId
    if (!userId) throw new AuthenticationError("no userId provided")

    return await db.portal.update({
      where: { id: portalId },
      data: {
        proposalLink: {
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
