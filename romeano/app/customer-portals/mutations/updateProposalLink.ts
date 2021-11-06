import { AuthenticationError, resolver } from "blitz"
import db from "db"
import { z } from "zod"

export const UpdateProposalLink = z.object({
  portalId: z.number().nonnegative(),
  linkId: z.number().nonnegative(),
})

export default resolver.pipe(
  resolver.zod(UpdateProposalLink),
  resolver.authorize(),
  async ({ portalId, linkId }, ctx) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const userId = ctx.session.userId
    if (!userId) throw new AuthenticationError("no userId provided")

    return await db.portal.update({
      where: { id: portalId },
      data: {
        proposalLink: { connect: { id: linkId } },
      },
    })
  }
)
