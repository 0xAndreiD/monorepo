import { AuthenticationError, AuthorizationError, Ctx, resolver, Middleware, NotFoundError } from "blitz"
import db, { LinkType, Prisma } from "db"
import { groupBy } from "lodash"
import { z } from "zod"
import { decodeHashId } from "../../core/util/crypto"

export const LogoData = z.object({
  url: z.any(),
  linkId: z.number().optional(),
})

export const middleware: Middleware[] = [
  async (req, res, next) => {
    return next()
  },
]

export default resolver.pipe(resolver.zod(LogoData), resolver.authorize(), async (params, ctx: Ctx) => {
  const userId = ctx.session.userId
  if (!userId) throw new AuthenticationError("no userId provided")

  await db.vendor.update({
    where: {
      id: ctx.session.vendorId,
    },
    data: {
      logoUrl: params.url,
    },
  })
})
