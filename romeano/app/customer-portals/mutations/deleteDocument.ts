import { getDocuments } from "app/portal-details/queries/getPortalDetail"
import { AuthorizationError, NotFoundError, resolver, Ctx } from "blitz"
import db from "db"
import { z } from "zod"

const DeleteDocument = z.object({
  id: z.number(),
})

export default resolver.pipe(resolver.zod(DeleteDocument), resolver.authorize(), async ({ id, ...data }, ctx: Ctx) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant

  //TODO FIXME: make sure delete is only for vendor (created by customer)
  // DELETE ASSOCIATED LINK AND THEN THE DOCUMENT
  const document = await db.portalDocument.findUnique({
    where: {
      id,
    },
  })
  if (!document) {
    throw new NotFoundError()
  }
  if (document.vendorId !== ctx.session.vendorId) {
    throw new AuthorizationError("Not authorized to delete this document")
  }

  await db.portalDocument.delete({
    where: {
      id,
    },
  })
  return await db.link.delete({
    where: {
      id: document.linkId,
    },
  })
})
