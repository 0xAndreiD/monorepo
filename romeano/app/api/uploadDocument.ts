import { AuthorizationError, getSession, invokeWithMiddleware, NotFoundError } from "blitz"
import db, { EventType, LinkType } from "../../db"
import { NextApiRequest, NextApiResponse } from "next"
import { z } from "zod"
import nc from "next-connect"
import { INTERNAL_UPLOAD_FS_PATH, UPLOAD_SIZE_LIMIT } from "../core/config"
import formidable, { Fields, Files } from "formidable"
import { flatten, isNil } from "lodash"
import createEvent from "../event/mutations/createEvent"

export const config = {
  api: {
    bodyParser: false,
  },
}

const uploadDocument = nc<NextApiRequest & { fields: Fields; files: Files }, NextApiResponse>()
  .use((req, res, next) => {
    const form = formidable({
      multiples: true,
      uploadDir: INTERNAL_UPLOAD_FS_PATH,
      maxFileSize: UPLOAD_SIZE_LIMIT,
      keepExtensions: true,
      // //@ts-ignore
      // filename: (name,ext, part, form) => {
      //   console.log("in filename")
      //   console.log(name,ext,part,form)
      //   return path.join(UPLOAD_DIR, part )//?? uuid());
      // },
    })

    form.parse(req, (err, fields, files) => {
      if (err) {
        console.error("Error parsing upload: ", err)
        return next(err)
      }
      req.fields = fields
      req.files = files
      next()
    })
  })
  .post(async (req, res, next) => {
    const session = await getSession(req, res)
    const userId = session.userId
    if (isNil(userId)) throw new AuthorizationError("invalid user id")
    const fields = z.object({ portalId: z.string().nonempty().transform(parseInt) }).parse(req.fields)
    const portalId = fields.portalId

    const portal = await db.portal.findUnique({ where: { id: portalId } })
    if (!portal) throw new NotFoundError("customer portal not found")

    console.log("fileUpload(): file uploaded with portalId:", portalId)

    const documentInserts = flatten(Object.values(req.files)).map((file) =>
      db.portalDocument
        .create({
          data: {
            portal: { connect: { id: portalId } },
            link: {
              create: {
                body: file.name ?? "Untitled File",
                //file.path looks like $INTERNAL_UPLOAD_FS_PATH/upload.jpg
                href: file.path.substring(INTERNAL_UPLOAD_FS_PATH.length + 1), //+1 to omit the slash
                type: LinkType.Document,
                creator: { connect: { id: userId } },
              },
            },
          },
          include: { link: true },
        })
        .then((portalDocument) =>
          invokeWithMiddleware(
            createEvent,
            {
              portalId,
              type: EventType.DocumentUpload,
              linkId: portalDocument.link.id,
            },
            { req, res }
          )
        )
    )
    await Promise.all(documentInserts)

    res.status(200).end()
  })

export default uploadDocument
