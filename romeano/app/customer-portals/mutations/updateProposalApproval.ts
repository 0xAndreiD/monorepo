import { AuthenticationError, Ctx, resolver } from "blitz"
import db from "db"
import { z } from "zod"

const UpdateNextStepsTask = z.object({
  portalId: z.number(),
  isApprove: z.boolean()
})

export default resolver.pipe(resolver.zod(UpdateNextStepsTask),
  resolver.authorize(),
  async ({ portalId, isApprove }, ctx: Ctx) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const userId = ctx.session.userId
    if (!userId) throw new AuthenticationError("no userId provided")

    const task = await db.stakeholder.update({ where: { userId}, data: { isApprovedBy: isApprove } })

    return task
  })
