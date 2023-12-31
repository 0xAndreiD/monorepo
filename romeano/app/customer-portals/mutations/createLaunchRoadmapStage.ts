import { AuthenticationError, resolver } from "blitz"
import db from "db"
import { z } from "zod"
import { decodeHashId } from "../../core/util/crypto"

export const CreateLaunchRoadmapStage = z.object({
  portalId: z.string(),
  date: z.date(),
  heading: z.string().nonempty(),
})

export default resolver.pipe(resolver.zod(CreateLaunchRoadmapStage), resolver.authorize(), async (data, ctx) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const userId = ctx.session.userId
  if (!userId) throw new AuthenticationError("no userId provided")

  return await db.roadmapStage.create({
    data: {
      portalId: decodeHashId(data.portalId),
      vendorId: ctx.session.vendorId,
      heading: data.heading,
      date: data.date,
    },
  })
})
