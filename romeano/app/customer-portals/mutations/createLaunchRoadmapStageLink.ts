import { AuthenticationError, resolver } from "blitz"
import db, { LinkType } from "db"
import { z } from "zod"

export const createLaunchRoadmapStageLink = z.object({
  launchRoadmapStageId: z.number().nonnegative(),
  link: z.object({
    //make new link
    body: z.string().nonempty(),
    href: z.string().nonempty(),
    type: z.nativeEnum(LinkType),
  }),
})

export default resolver.pipe(
  resolver.zod(createLaunchRoadmapStageLink),
  resolver.authorize(),
  async ({ launchRoadmapStageId, link }, ctx) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const userId = ctx.session.userId
    if (!userId) throw new AuthenticationError("no userId provided")

    return await db.roadmapStage.update({
      where: { id: launchRoadmapStageId },
      data: {
        ctaLink: {
          create: {
            ...link,
            creator: { connect: { id: userId } },
          },
        },
      },
      include: { ctaLink: true },
    })
  }
)
