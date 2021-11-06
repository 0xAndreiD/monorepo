import serveStatic from "serve-static"
import nc from "next-connect"
import { INTERNAL_UPLOAD_FS_PATH } from "app/core/config"

const serve = serveStatic(INTERNAL_UPLOAD_FS_PATH, {
  index: false,
})
const filePath = nc({
  onError: (err) => console.error("Error handling viewDocument():", err),
  // onNoMatch: (req) => console.log("viewDocument(): No match:", req.statusMessage, req.url, req.headers)
}).use("/api/viewDocument", serve)

export default filePath
