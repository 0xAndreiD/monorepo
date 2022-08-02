import { AuthenticationError, resolver } from "blitz"
import db from "db"
import { z } from "zod"
import { decodeHashId } from "../../core/util/crypto"

export const EditProductInfoSection = z.object({
  portalId: z.string(),
  sectionId: z.number(),
  heading: z.string(),
})

export default resolver.pipe(
  resolver.zod(EditProductInfoSection),
  resolver.authorize(),
  async ({ portalId, sectionId, heading }, ctx) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const userId = ctx.session.userId
    if (!userId) throw new AuthenticationError("no userId provided")

    const section = await db.productInfoSection.findUnique({
      where: {
        id: sectionId,
      },
    })
    if (!section) {
      console.warn("Section not found while updating", sectionId)
      return
    }
    if (section.portalId !== decodeHashId(portalId)) {
      console.warn("Section portal ID mismatch while updating", section?.portalId, portalId)
      return
    }

    return await db.productInfoSection.update({
      where: {
        id: sectionId,
      },
      data: {
        heading: heading,
      },
    })
  }
)
