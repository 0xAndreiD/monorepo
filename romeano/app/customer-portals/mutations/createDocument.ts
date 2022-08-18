import { AuthenticationError, resolver } from "blitz"
import db from "db"
import { z } from "zod"
import { decodeHashId } from "../../core/util/crypto"

export const CreateDocument = z.object({
  portalId: z.any(),
  linkId: z.any(),
})

export default resolver.pipe(resolver.zod(CreateDocument), resolver.authorize(), async ({ portalId, linkId }, ctx) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const userId = ctx.session.userId
  if (!userId) throw new AuthenticationError("no userId provided")

  return (
    await db.portalDocument.create({
      data: {
        portal: { connect: { id: decodeHashId(portalId) } },
        link: { connect: { id: linkId } },
        vendor: { connect: { id: ctx.session.vendorId } },
      },
      include: { link: true },
    })
  ).link
})
