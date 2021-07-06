import { AuthenticationError, Ctx, resolver } from "blitz"
import db from "db"
import { z } from "zod"

const UpdateProposalApproval = z.object({
  portalId: z.number(),
  hasStakeholderApproved: z.boolean()
})

export default resolver.pipe(resolver.zod(UpdateProposalApproval),
  resolver.authorize(),
  async ({ portalId, hasStakeholderApproved }, ctx: Ctx) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const userId = ctx.session.userId
    if (!userId) throw new AuthenticationError("no userId provided")

    const task = await db.userPortal.update({
      where: { userId_portalId: { userId, portalId } },
      data: { hasStakeholderApproved }
    })

    return task
  })
