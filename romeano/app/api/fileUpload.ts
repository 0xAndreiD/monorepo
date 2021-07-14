import { AuthorizationError, getSession, NotFoundError } from "blitz"
import db from "../../db"
import { NextApiRequest, NextApiResponse } from "next"
import { z } from "zod"
import nc from "next-connect"
import { UPLOAD_DIR } from "../core/config"
import formidable, { Fields, Files } from "formidable"
import { flatten, isNil } from "lodash"

export const config = {
  api: {
    bodyParser: false
  }
}
const uploadPath = `public/${UPLOAD_DIR}`

const fileUpload = nc<NextApiRequest & { fields: Fields, files: Files }, NextApiResponse>()
  .use((req, res, next) => {
    const form = formidable({
      multiples: true,
      uploadDir: uploadPath,
      maxFileSize: 25 * 1000 * 1000,
      keepExtensions: true
      // //@ts-ignore
      // filename: (name,ext, part, form) => {
      //   console.log("in filename")
      //   console.log(name,ext,part,form)
      //   return path.join(UPLOAD_DIR, part )//?? uuid());
      // },
    })

    form.parse(req, (err, fields, files) => {
      if (err) {
        return next(err)
      }
      req.fields = fields
      req.files = files
      next()
    })
  })
  .post(async (req, res,next) => {
    const session = await getSession(req, res)
    const userId = session.userId
    if (isNil(userId)) throw new AuthorizationError("invalid user id")
    const fields = z.object({ portalId: z.string().nonempty().transform(parseInt) }).parse(req.fields)
    const portalId = fields.portalId

    const portal = await db.portal.findUnique({ where: { id: portalId } })
    if (!portal) throw new NotFoundError("customer portal not found")

    console.log("fileUpload(): file uploaded with portalId:", portalId)

    const documentInserts = flatten(Object.values(req.files))
      .map(file => ({
        portalId: portalId,
        title: file.name ?? "Untitled File",
        path: file.path.substring(uploadPath.length + 1),//+1 for slash
        isCompleted: false,
        userId
      }))
    await db.document.createMany({ data: documentInserts })
    res.status(200).end()
  })

export default fileUpload
