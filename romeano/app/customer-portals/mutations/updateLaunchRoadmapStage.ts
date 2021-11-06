import { AuthenticationError, resolver } from "blitz"
import db from "db"
import { z } from "zod"

export const UpdateLaunchRoadmapStage = z.object({
  portalId: z.number(),
  roadmapStageId: z.number().nonnegative(),
  date: z.date().optional(),
  heading: z.string().nonempty(),
  tasks: z.string().array(),
  linkId: z.number().nonnegative().optional(),
})

export default resolver.pipe(resolver.zod(UpdateLaunchRoadmapStage), resolver.authorize(), async (data, ctx) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const userId = ctx.session.userId
  if (!userId) throw new AuthenticationError("no userId provided")

  return await db.roadmapStage.update({
    data: {
      date: data.date ?? null,
      heading: data.heading,
      tasks: data.tasks,
      ctaLinkId: data.linkId ?? null,
    },
    where: { id: data.roadmapStageId },
  })
})
