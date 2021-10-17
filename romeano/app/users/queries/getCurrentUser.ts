import { Ctx, resolver } from "blitz"
import db from "db"
import { z } from "zod"

export const GetCurrentUser = z.object({
  portalId: z.number().nonnegative().optional(),
})

export default resolver.pipe(resolver.zod(GetCurrentUser), async ({ portalId }, { session }: Ctx) => {
  if (!session.userId) return null

  const user = await db.user.findFirst({
    include: {
      accountExecutive: true,
      stakeholder: true,
      userPortals: { where: { portalId } },
    },
    where: { id: session.userId },
  })

  return { ...user, role: user?.userPortals[0]?.role }
})
