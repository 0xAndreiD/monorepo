import { Ctx, Middleware, resolver } from "blitz"
import db, { EventType } from "db"
import { z } from "zod"

import { decodeHashId } from "../../core/util/crypto"

//TODO: keep this in sync with redir.tsx
export const CreateEvent = z.object({
  type: z.nativeEnum(EventType),
  url: z.string().optional(),
  // ip: z.string(),
  // userAgent: z.string().optional(),
  linkId: z.number().optional(),
  portalId: z.string(),
  // userId: z.number()
  // vendorId: z.number()
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
      linkId: params.linkId,
      portalId: decodeHashId(params.portalId),
      userId: context.session.userId!,
      vendorId: context.session.vendorId!,
    },
  })
})
