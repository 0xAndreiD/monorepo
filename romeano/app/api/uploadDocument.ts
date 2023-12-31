import { AuthorizationError, getSession, invokeWithMiddleware, NotFoundError } from "blitz"
import db, { EventType, Link, LinkType } from "../../db"
import { NextApiRequest, NextApiResponse } from "next"
import { z } from "zod"
import nc from "next-connect"
import { INTERNAL_UPLOAD_FS_PATH, UPLOAD_SIZE_LIMIT } from "../core/config"
import formidable, { Fields, Files } from "formidable"
import { flatten, isNil } from "lodash"
import createEvent from "../event/mutations/createEvent"
import { LinkWithId } from "../../types"
import { CreateDocument } from "app/customer-portals/mutations/createDocument"

import { decodeHashId } from "../core/util/crypto"

export const config = {
  api: {
    bodyParser: false, //cannot parse fields if bodyparser is enabled
  },
}

const UploadParams = z.object({
  portalId: z.preprocess(String, z.string()),
})
export type UploadParams = z.infer<typeof UploadParams>

//on uploadDocument, get the fields and the files from the nextRequest, and Respond w LinkWId
const uploadDocument = nc<NextApiRequest & { fields: Fields; files: Files }, NextApiResponse<LinkWithId[]>>()
  .use((req, res, next) => {
    console.log("num files")
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
    const { portalId } = UploadParams.parse(req.fields)

    const portal = await db.portal.findUnique({ where: { id: decodeHashId(portalId) } })
    if (!portal) throw new NotFoundError("customer portal not found")

    console.log("fileUpload(): file uploaded")

    //create the link, add to DB and create the event for document upload
    const rawFiles = flatten(Object.values(req.files))
    const docs = rawFiles.map(async (file): Promise<LinkWithId> => {
      const link = await db.link.create({
        data: {
          body: file.originalFilename ?? "Untitled File",
          href: file.newFilename!,
          type: LinkType.Document,
          creator: { connect: { id: userId } },
          vendor: { connect: { id: session.vendorId } },
        },
      })
      await invokeWithMiddleware(
        createEvent,
        {
          portalId,
          type: EventType.DocumentUpload,
          url: "/api/viewDocument" + link.href,
          linkId: link.id,
        },
        { req, res }
      )
      // await invokeWithMiddleware(
      //   CreateDocument,
      //   {
      //     portalId: portalId,
      //     link: link.id,
      //   },
      //   { req, res }
      // )
      return { id: link.id, body: link.body, href: link.href }
    })

    const allDocs: LinkWithId[] = await Promise.all(docs)
    res.send(allDocs)
    res.status(200).end()
  })

export default uploadDocument
