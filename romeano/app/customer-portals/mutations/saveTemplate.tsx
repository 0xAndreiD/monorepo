import { AuthenticationError, resolver } from "blitz"
import db, { LinkType, Role } from "db"
import { debuglog } from "util"
import { z } from "zod"

export const SaveTemplate = z.object({
  portalId: z.number(),
  templateName: z.string(),
})

export default resolver.pipe(resolver.zod(SaveTemplate), resolver.authorize(), async (data, ctx) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const userId = ctx.session.userId
  if (!userId) throw new AuthenticationError("no userId provided")

  const user = await db.user.findUnique({ where: { id: userId } })
  const accountExec = await db.accountExecutive.findUnique({ where: { userId: userId } })
  if (!accountExec) throw new AuthenticationError("Portal can only be created by an AE")

  const portal = await db.portal.findUnique({
    where: {
      id: data.portalId,
    },
    include: {
      roadmapStages: true,
      nextStepsTasks: true,
      images: true,
      productInfoSections: true,
      portalDocuments: true,
      internalNotes: true,
    },
  })

  // const vendorTeam = await db.vendorTeam.findUnique({ where: {id: accountExec.vendorTeamId}})
  // if(!vendorTeam) throw new AuthenticationError("No vendor team associated w AE when creating portal")

  const template = await db.template.create({
    data: {
      name: data.templateName,
      proposalHeading: portal?.proposalHeading ?? "",
      proposalSubheading: portal?.proposalSubheading ?? "",
    },
  })

  //attach template id across the DB
  portal?.roadmapStages.map(
    async (roadmapStage) =>
      await db.roadmapStage.upsert({
        where: { id: roadmapStage.id },
        update: { templateId: template.id },
        create: roadmapStage,
      })
  )

  portal?.images.map(
    async (image) =>
      await db.portalImage.upsert({
        where: { id: image.id },
        update: { templateId: template.id },
        create: image,
      })
  )

  portal?.nextStepsTasks.map(
    async (nextStepsTask) =>
      await db.nextStepsTask.upsert({
        where: { id: nextStepsTask.id },
        update: { templateId: template.id },
        create: nextStepsTask,
      })
  )

  portal?.productInfoSections.map(
    async (productInfoSection) =>
      await db.productInfoSection.upsert({
        where: { id: productInfoSection.id },
        update: { templateId: template.id },
        create: productInfoSection,
      })
  )

  portal?.portalDocuments.map(
    async (portalDocument) =>
      await db.portalDocument.upsert({
        where: { id: portalDocument.id },
        update: { templateId: template.id },
        create: portalDocument,
      })
  )

  portal?.internalNotes.map(
    async (internalNote) =>
      await db.internalNote.upsert({
        where: { id: internalNote.id },
        update: { templateId: template.id },
        create: internalNote,
      })
  )

  // userPortals:         UserPortal[]
})
