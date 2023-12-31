import { AuthenticationError, resolver } from "blitz"
import db from "db"
import { z } from "zod"

import { encodeHashId, decodeHashId } from "../../core/util/crypto"

export const UpdateCurrentLaunchRoadmapStage = z.object({
  portalId: z.string(),
  currentRoadmapStage: z.number(),
})

export default resolver.pipe(
  resolver.zod(UpdateCurrentLaunchRoadmapStage),
  resolver.authorize(),
  async ({ portalId, currentRoadmapStage }, ctx) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const userId = ctx.session.userId
    if (!userId) throw new AuthenticationError("no userId provided")

    return await db.portal.update({
      data: { currentRoadmapStage },
      where: { id: decodeHashId(portalId) },
    })
  }
)
