import { BlitzApiHandler, getSession, NotFoundError } from "blitz"
import db from "../../db"
import multer from "multer"
import { NextApiRequest, NextApiResponse } from "next"
import { z } from "zod"

const upload = multer({
  limits: { fileSize: 25 * 1024 * 1024 },
  storage: multer.diskStorage({
    destination: "uploads"
    // filename: (req, file, callback) => {
    //   callback(null, generateFilename())
    // },
  })
})


// Helper method to wait for a middleware to execute before continuing
// And to throw an error when an error happens in a middleware
function runMiddleware(req: NextApiRequest, res: NextApiResponse, fn: any) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result)
      }

      return resolve(result)
    })
  })
}

const stats: BlitzApiHandler = async (req, res) => {
  const session = await getSession(req, res)
  console.log("User ID:", session)

  await runMiddleware(req, res, upload.single("file"))

  const schema = z.object({ portalId: z.string() })
  const parsedPortalId = schema.safeParse(req.body)
  if (!parsedPortalId.success) {
    // res.body = "portalId parameter not found";
    // res.status = 404; //not found
    return
  }
  const portalId = parseInt(parsedPortalId.data.portalId)

  const portal = await db.portal.findUnique({ where: { id: portalId } })
  if (!portal) {
    throw new NotFoundError("customer portal not found")
  }
  console.log("fileUpload(): file uploaded with portalId:", portalId)
  // console.log("fileUpload(): files:", ctx.request.files);
  // if (!ctx.request.files) {
  //   ctx.throw(400, "no files attached");
  //   return; //needed since typescript doesnt type narrow with ctx.throw
  // }

  await db.document.create({
    data: {
      portalId: portalId,
      title: req.file.filename ?? "Untitled File",
      href: `${req.file.filename}`,
      isCompleted: false,
      userId: 1 //FIXME!
    }
  })
}
export default stats
