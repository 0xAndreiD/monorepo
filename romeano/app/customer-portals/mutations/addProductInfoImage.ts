import PortalDetails from "app/pages/portalDetails/[portalId]"
import { AuthenticationError, AuthorizationError, Ctx, resolver, Middleware, NotFoundError } from "blitz"
import db, { LinkType, Prisma, Portal } from "db"
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

  await db.portalImage.create({
    data: {
      href: "http://127.0.0.1:3000/" + params.url,
      portalId: params.portalId,
    },
  })

  //   await db.portal.update({
  //     where: {
  //       id: params.portalId,
  //     },
  //     data: {
  //       images: {
  //           push: portalImage
  //       }
  //     },
  //   })
})
