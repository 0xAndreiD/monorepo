import { AuthenticationError, resolver, NotFoundError } from "blitz"
import db from "db"
import { z } from "zod"

const DeleteNextStepsTask = z.object({
  portalId: z.number(),
  current: z.number(),
})

export default resolver.pipe(
  resolver.zod(DeleteNextStepsTask),
  /*resolver.authorize(),*/ async ({ current, ...data }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const portal = await db.portal.findUnique({ where: { id: data.portalId } })
    if (!portal) throw new NotFoundError("customer portal not found")
    //TODO FIXME: make sure delete is only for vendor (created by customer)

    //get all the images affiliated with the portal
    const portalImages = await db.portalImage.findMany({ where: { portalId: data.portalId } })

    //delete the i'th image where i is the current image from Carousel
    const imageToDelete = portalImages[current - 1]

    return await db.portalImage.delete({ where: { id: imageToDelete.id } })
  }
)
