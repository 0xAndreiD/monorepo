import { decodeHashId } from "app/core/util/crypto"
import { AuthenticationError, Ctx, resolver } from "blitz"
import db from "db"
import { z } from "zod"

const UpdateProposalText = z.object({
  portalId: z.string(),
  proposalHeading: z.string().nonempty(),
  proposalSubheading: z.string().nonempty(),
})

export default resolver.pipe(
  resolver.zod(UpdateProposalText),
  resolver.authorize(),
  async ({ portalId, proposalHeading, proposalSubheading }, ctx: Ctx) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const userId = ctx.session.userId
    if (!userId) throw new AuthenticationError("no userId provided")

    const proposalText = await db.userPortal.update({
      where: { userId_portalId: { userId, portalId: decodeHashId(portalId) } },
      data: {
        portal: {
          update: {
            proposalHeading,
            proposalSubheading,
          },
        },
      },
    })

    await db.portal.update({
      where: { id: decodeHashId(portalId) },
      data: {
        proposalHeading,
        proposalSubheading,
      },
    })

    return proposalText
  }
)
