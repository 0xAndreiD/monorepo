import { resolver, NotFoundError } from "blitz"
import db, { CustomerOrVendor, Role } from "db"
import { z } from "zod"

const GetPortalDetail = z.object({
  // This accepts type of undefined, but is required at runtime
  id: z.number().optional().refine(Boolean, "Required")
})

export default resolver.pipe(resolver.zod(GetPortalDetail),async ({ id }) => {
// export default resolver.pipe(resolver.zod(GetPortalDetail), resolver.authorize(), async ({ id }) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const portal = await db.portal.findFirst({
    where: { id },
    include: {
      roadmapStages: {
        include: { tasks: true } //get the associated tasks for a stage
      },
      nextStepsTasks: { orderBy: { id: "asc" } },
      vendor: true,
      documents: { orderBy: { id: "asc" } },
      images: { orderBy: { id: "asc" } },
      productInfoSections: { include: { links: true } },
      userPortals: {
        include: {
          user: {
            include: {
              accountExecutive: true,
              stakeholder: true
            }
          }
        }
      },
      internalNotes: true,
    }
  })

  if (!portal) throw new NotFoundError()
return {}
})
