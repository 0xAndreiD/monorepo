import { Ctx, resolver } from "blitz"
import db from "db"
import { z } from "zod"

import { decodeHashId } from "../../core/util/crypto"

export const GetCurrentUser = z.object({
  portalId: z.string().optional(),
})

export default resolver.pipe(resolver.zod(GetCurrentUser), async ({ portalId }, { session }: Ctx) => {
  if (!session.userId) return null

  const user = await db.user.findUnique({
    where: { id: session.userId },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      photoUrl: true,
      email: true,
      role: true,
      accountExecutive: {
        select: {
          id: true,
          jobTitle: true,
          vendorTeamId: true,
          userId: true,
          vendorTeam: {
            select: {
              id: true,
              vendorId: true,
            },
          },
        },
      },
      stakeholder: true,
      userPortals: portalId
        ? {
            where: { portalId: decodeHashId(portalId) },
            select: {
              userId: true,
              portalId: true,
              role: true,
              hasStakeholderApproved: true,
              isPrimaryContact: true,
              isSecondaryContact: true,
              templateId: true,
            },
          }
        : false,
    },
  })

  return { ...user, role: user?.userPortals?.[0]?.role }
})
