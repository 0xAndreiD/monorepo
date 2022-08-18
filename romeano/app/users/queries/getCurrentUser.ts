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
  // eslint-disable-next-line
  async (input: { portalId: string }, ctx: Ctx) => {
    const user = await db.user.findUnique({
      where: { id: ctx.session.userId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        photoUrl: true,
        email: true,
        role: true,
        vendorId: true,
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
              where: { portalId: decodeHashId(input.portalId) },
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

    return { ...user, role: user?.userPortals?.[0]?.role }
  }
)
function async(
  arg0: { portalId: any },
  arg1: { session<Session>(): any },
  Ctx: any
): (i: { portalId?: string | undefined }, c: import("blitz").AuthenticatedMiddlewareCtx) => unknown {
  throw new Error("Function not implemented.")
}
