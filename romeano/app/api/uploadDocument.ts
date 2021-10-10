import { AuthorizationError, getSession, invokeWithMiddleware, NotFoundError } from "blitz"
import db, { EventType, Link, LinkType } from "../../db"
import { NextApiRequest, NextApiResponse } from "next"
import { z } from "zod"
import nc from "next-connect"
import { INTERNAL_UPLOAD_FS_PATH, UPLOAD_SIZE_LIMIT } from "../core/config"
import formidable, { Fields, Files } from "formidable"
import { flatten, isNil } from "lodash"
import createEvent from "../event/mutations/createEvent"
import { LinkWithId, UploadType } from "../../types"

export const config = {
  api: {
    bodyParser: false, //cannot parse fields if bodyparser is enabled
  },
}

const UploadParams = z.object({
  portalId: z.preprocess(Number, z.number()),
})
export type UploadParams = z.infer<typeof UploadParams>

async function insert(userId: number, fileName: string, filePath: string): Promise<Link> {
  const linkInsertQuery = {
    data: {
      body: fileName,
      //file.path looks like $INTERNAL_UPLOAD_FS_PATH/upload.jpg
      href: filePath.substring(INTERNAL_UPLOAD_FS_PATH.length + 1), //+1 to omit the slash
      type: LinkType.Document,
      creator: { connect: { id: userId } },
    },
  }

  return db.link.create(linkInsertQuery)
  // switch (fields.uploadType) {
  //   case UploadType.Document:
  //     return (
  //       await db.portalDocument.create({
  //         data: {
  //           portal: { connect: { id: fields.portalId } },
  //           link: linkInsertQuery,
  //         },
  //         include: { link: true },
  //       })
  //     ).link
  //   case UploadType.ProductInfo:
  //     return (
  //       await db.productInfoSectionLink.create({
  //         data: {
  //           productInfoSection: { connect: { id: fields.productInfoSectionId } },
  //           link: linkInsertQuery,
  //         },
  //         include: { link: true },
  //       })
  //     ).link
  //   case UploadType.Proposal:
  //     return (
  //       await db.portal.update({
  //         where: { id: fields.portalId },
  //         data: {
  //           proposalLink: linkInsertQuery,
  //         },
  //         include: { proposalLink: true },
  //       })
  //     ).proposalLink! //non-null because we just updated it
  // }
}

const uploadDocument = nc<NextApiRequest & { fields: Fields; files: Files }, NextApiResponse<LinkWithId[]>>()
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
    const { portalId } = UploadParams.parse(req.fields)

    const portal = await db.portal.findUnique({ where: { id: portalId } })
    if (!portal) throw new NotFoundError("customer portal not found")

    console.log("fileUpload(): file uploaded")

    const rawFiles = flatten(Object.values(req.files))
    const docs = rawFiles.map(async (file): Promise<LinkWithId> => {
      const link = await insert(userId, file.name ?? "Untitled File", file.path)
      await invokeWithMiddleware(
        createEvent,
        {
          portalId,
          type: EventType.DocumentUpload,
          linkId: link.id,
        },
        { req, res }
      )
      return { id: link.id, body: link.body, href: link.href }
    })

    const allDocs: LinkWithId[] = await Promise.all(docs)
    res.send(allDocs)
    res.status(200).end()
  })

export default uploadDocument
