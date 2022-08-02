import { AuthenticationError, resolver } from "blitz"
import db from "db"
import { z } from "zod"
import { decodeHashId } from "../../core/util/crypto"

export const DeleteProductInfoSection = z.object({
  portalId: z.string(),
  sectionId: z.number(),
})

export default resolver.pipe(
  resolver.zod(DeleteProductInfoSection),
  resolver.authorize(),
  async ({ portalId, sectionId }, ctx) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const userId = ctx.session.userId
    if (!userId) throw new AuthenticationError("no userId provided")

    const section = await db.productInfoSection.findUnique({
      where: {
        id: sectionId,
      },
      include: {
        productInfoSectionLink: {
          include: {
            link: true,
          },
        },
      },
    })
    console.log("Trying to delete section on portalId", section, portalId)
    if (!section) {
      console.warn("Section not found while trying to delete", sectionId)
      return
    }
    if (section.portalId !== decodeHashId(portalId)) {
      console.warn("Section does not belong to portal while trying to delete", section.portalId, decodeHashId(portalId))
      return
    }

    // Delete all associated links first before deleting section
    await Promise.all(
      section.productInfoSectionLink.map(async (sectionLink) => {
        console.log("Deleting section link", sectionLink)

        // Delete productInfoSectionLink
        console.log("Deleting productInfoSectionLink", sectionLink.id)
        await db.productInfoSectionLink.delete({
          where: {
            id: sectionLink.id,
          },
        })

        // Delete associated link
        console.log("Deleting link", sectionLink.linkId)
        await db.link.delete({
          where: {
            id: sectionLink.linkId,
          },
        })

        return true
      })
    )

    // Delete productInfoSection
    return await db.productInfoSection.delete({
      where: {
        id: sectionId,
      },
    })
  }
)
