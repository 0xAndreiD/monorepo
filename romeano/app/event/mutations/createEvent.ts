import { Ctx, getSession, Middleware, resolver, Routes } from "blitz"
import db, { EventType } from "db"
import { z } from "zod"

const GetPortalDetail = z.object({
  // This accepts type of undefined, but is required at runtime
  portalId: z.string().transform(parseInt),
  documentId: z.string().transform(parseInt).optional(),
  eventType: z.nativeEnum(EventType),
  url: z.string()


  type: eventType,
  url,
  ip: z.ip
  userAgent: z.string(),
  documentId: z.number().optional()

})


export const middleware: Middleware[] = [
  async (req, res, next) => {
    res.blitzCtx.ip = req.socket.remoteAddress
    res.blitzCtx.headers = req.headers
    return next()
  }
]

export default resolver.pipe(resolver.zod(GetPortalDetail), resolver.authorize(), async ({ portalId }, context: Ctx) => {

  context.session.context.session.userId
  //log event
  await db.event.create({
    data: {
      type: eventType,
      url,
      ip: context.req.socket.remoteAddress ?? "0.0.0.0", //null if client disconnects: https://nodejs.org/api/net.html#net_socket_remoteaddress
      userAgent: context.req.headers["user-agent"],
      documentId,
      portalId,
      userId: session.userId
    }
  })

}
