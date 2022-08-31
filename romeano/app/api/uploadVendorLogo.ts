import { AuthorizationError, getSession, invokeWithMiddleware, NotFoundError } from "blitz"
import db, { EventType, Link, LinkType } from "../../db"
import { NextApiRequest, NextApiResponse } from "next"
import { z } from "zod"
import nc from "next-connect"
import { INTERNAL_UPLOAD_FS_PATH, UPLOAD_SIZE_LIMIT } from "../core/config"
import formidable, { Fields, Files } from "formidable"
import { flatten, isNil } from "lodash"
import editVendorLogo from "../users/queries/editVendorLogo"
import { LinkWithId } from "../../types"

import { decodeHashId } from "../core/util/crypto"

export const config = {
  api: {
    bodyParser: false, //cannot parse fields if bodyparser is enabled
  },
}

const UploadVendorLogoParams = z.object({})
export type UploadVendorLogoParams = z.infer<typeof UploadVendorLogoParams>

const uploadVendorLogo = nc<NextApiRequest & { fields: Fields; files: Files }, NextApiResponse<LinkWithId[]>>()
  .use((req, res, next) => {
    const form = formidable({
      uploadDir: INTERNAL_UPLOAD_FS_PATH,
      maxFileSize: UPLOAD_SIZE_LIMIT,
      keepExtensions: true,
    })

    form.parse(req, (err, fields, files) => {
      if (err) {
        console.error("Error parsing upload: ", err)
        return next(err)
      }
      console.log("fields")
      req.fields = fields
      req.files = files
      next()
    })
  })
  .post(async (req, res, next) => {
    const session = await getSession(req, res)
    const userId = session.userId
    if (isNil(userId)) throw new AuthorizationError("invalid user id")

    const vendor = await db.vendor.findUnique({ where: { id: session.vendorId } })
    if (!vendor) throw new AuthorizationError()

    console.log("fileUpload(): file uploaded ggg")

    const rawFiles = flatten(Object.values(req.files))

    console.log(rawFiles)

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
        editVendorLogo,
        {
          url: "/api/viewDocument/" + link.href,
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

export default uploadVendorLogo
