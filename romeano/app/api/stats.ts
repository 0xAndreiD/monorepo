import { BlitzApiHandler, getSession, invokeWithMiddleware } from "blitz"
import db from "../../db"
import createEvent from "../event/mutations/createEvent"

const stats: BlitzApiHandler = async (req, res) => {
  const session = await getSession(req, res)
  console.log("User ID:", session)

  // await invokeWithMiddleware(createEvent,{
  //   type: eventType,
  //   url:,
  //   documentId,
  //   portalId,
  //   userId: session.userId
  // }, {req, res})


  res.statusCode = 200
  res.setHeader("Content-Type", "application/json")
  res.end(JSON.stringify({ name: "John Doe" }))
}
export default stats
