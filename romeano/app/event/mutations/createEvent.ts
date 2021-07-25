import { Ctx, Middleware, resolver } from "blitz"
import db, { EventType } from "db"
import { z } from "zod"

const CreateEvent = z.object({
  portalId: z.number().nonnegative(),
  type: z.nativeEnum(EventType),
  url: z.string().optional(),
  // ip: z.string(),
  // userAgent: z.string().optional(),
  documentId: z.number().optional(),
  // userId: z.number()
})

export const middleware: Middleware[] = [
  async (req, res, next) => {
    res.blitzCtx.ip = req.socket.remoteAddress
    res.blitzCtx.headers = req.headers
    return next()
  }
]

export default resolver.pipe(resolver.zod(CreateEvent), resolver.authorize(), async (params, context: Ctx) => {
    await db.event.create({
      data: {
        type: params.type,
        url: params.url,
        ip: context.ip,
        userAgent: context.headers?.["user-agent"],
        documentId: params.documentId,
        portalId: params.portalId,
        userId: context.session.userId ?? 0
      }
    })
  }
)
