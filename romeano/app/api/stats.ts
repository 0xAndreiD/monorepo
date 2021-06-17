import { BlitzApiHandler, getSession } from "blitz"

const stats: BlitzApiHandler = async (req, res) => {
  const session = await getSession(req, res)
  console.log("User ID:", session)

  res.statusCode = 200
  res.setHeader("Content-Type", "application/json")
  res.end(JSON.stringify({ name: "John Doe" }))
}
export default stats
