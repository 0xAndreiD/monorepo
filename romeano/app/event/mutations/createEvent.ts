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
  linkId: z.number().optional(),
  // userId: z.number()
})

function parseIp(data: string | string[] | undefined): string | undefined {
  if (typeof data === "string") {
    const parts = data.split(",")
    return parts[0].trim() //client is always the first element
  } else if (Array.isArray(data)) {
    return data[0].trim()
  }
}

export const middleware: Middleware[] = [
  async (req, res, next) => {
    res.blitzCtx.ip = parseIp(req.headers["x-forwarded-for"]) ?? req.socket.remoteAddress
    res.blitzCtx.headers = req.headers
    return next()
  },
]

export default resolver.pipe(resolver.zod(CreateEvent), resolver.authorize(), async (params, context: Ctx) => {
  await db.event.create({
    data: {
      type: params.type,
      url: params.url,
      ip: context.ip,
      userAgent: context.headers?.["user-agent"],
      documentId: params.documentId,
      linkId: params.linkId,
      portalId: params.portalId,
      userId: context.session.userId!,
    },
  })
})
