import { BlitzApiHandler, getSession } from "blitz"
import db from "../../db"

const stats: BlitzApiHandler = async (req, res) => {
  const session = await getSession(req, res)
  console.log("User ID:", session)

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

  res.statusCode = 200
  res.setHeader("Content-Type", "application/json")
  res.end(JSON.stringify({ name: "John Doe" }))
}
export default stats
