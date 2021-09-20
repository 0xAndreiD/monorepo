import { AuthenticationError, Ctx, resolver } from "blitz"
import db from "db"
import { z } from "zod"

const UpdateProposalText = z.object({
  portalId: z.number(),
  description: z.string().nonempty(),
  highlightItems: z.string().nonempty(),
})

export default resolver.pipe(
  resolver.zod(UpdateProposalText),
  resolver.authorize(),
  async ({ portalId, description, highlightItems }, ctx: Ctx) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const userId = ctx.session.userId
    if (!userId) throw new AuthenticationError("no userId provided")

    const proposalText = await db.userPortal.update({
      where: { userId_portalId: { userId, portalId } },
      data: {
        portal: {
          update: {
            proposalHeading: description,
            proposalSubheading: highlightItems,
          },
        },
      },
    })

    return proposalText
  }
)
