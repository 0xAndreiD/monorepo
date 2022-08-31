import { AuthenticationError, AuthorizationError, Ctx, resolver, Middleware, NotFoundError } from "blitz"
import db, { LinkType, Prisma } from "db"
import { groupBy } from "lodash"
import { z } from "zod"
import { decodeHashId } from "../../core/util/crypto"

export const LogoData = z.object({
  url: z.any(),
  linkId: z.number().optional(),
  portalId: z.string(),
})

export const middleware: Middleware[] = [
  async (req, res, next) => {
    return next()
  },
]

export default resolver.pipe(resolver.zod(LogoData), resolver.authorize(), async (params, ctx: Ctx) => {
  const userId = ctx.session.userId
  if (!userId) throw new AuthenticationError("no userId provided")

  const portal = await db.portal.findUnique({ where: { id: decodeHashId(params.portalId) } })
  if (!portal) throw new NotFoundError("customer portal not found")
  if (portal.vendorId !== ctx.session.vendorId)
    throw new AuthorizationError("customer portal not found for this vendor")

  await db.portal.update({
    where: {
      id: decodeHashId(params.portalId),
    },
    data: {
      customerLogoUrl: params.url,
    },
  })
})
