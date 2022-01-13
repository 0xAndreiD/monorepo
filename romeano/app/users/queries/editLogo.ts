import { AuthenticationError, AuthorizationError, Ctx, resolver, Middleware, NotFoundError } from "blitz"
import db, { LinkType, Prisma } from "db"
import { groupBy } from "lodash"
import { z } from "zod"

export const LogoData = z.object({
  url: z.any(),
  linkId: z.number().optional(),
  portalId: z.number().nonnegative(),
})

export const middleware: Middleware[] = [
  async (req, res, next) => {
    return next()
  },
]

export default resolver.pipe(resolver.zod(LogoData), resolver.authorize(), async (params, ctx: Ctx) => {
  const userId = ctx.session.userId
  if (!userId) throw new AuthenticationError("no userId provided")

  const portal = await db.portal.findUnique({ where: { id: params.portalId } })
  if (!portal) throw new NotFoundError("customer portal not found")

  await db.portal.update({
    where: {
      id: params.portalId,
    },
    data: {
      customerLogoUrl: params.url,
    },
  })
})
