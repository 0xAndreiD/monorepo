import { Ctx, resolver } from "blitz"
import db from "db"
import { z } from "zod"

import { decodeHashId } from "../../core/util/crypto"

export const GetCurrentUser = z.object({
  portalId: z.string().optional(),
})

export default resolver.pipe(
  resolver.authorize(),
  resolver.zod(GetCurrentUser),
  async ({ portalId }, { session }: Ctx) => {
    const user = await db.user.findUnique({
      where: { id: session.userId! },
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
            vendorId: true,
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
              where: {
                portalId: decodeHashId(portalId),
                vendorId: session.vendorId,
              },
              select: {
                userId: true,
                portalId: true,
                vendorId: true,
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
    console.log("GOT SESSION USER", session, user)
    // TODO: Remove role from here and use the one from session instead
    return { ...user, role: user?.userPortals?.[0]?.role, roles: session.roles }
  }
)
