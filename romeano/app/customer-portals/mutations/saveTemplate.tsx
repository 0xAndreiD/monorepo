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

  const templatePortal = await db.portal.create({
    data: {
      customerName: portal?.customerName ?? "",
      customerLogoUrl: "",
      currentRoadmapStage: portal?.currentRoadmapStage ?? 0,
      proposalHeading: portal?.proposalHeading ?? "",
      proposalSubheading: portal?.proposalSubheading ?? "",
      userPortals: {
        createMany: {
          data: [
            {
              userId: userId,
              role: Role.AccountExecutive,
              isPrimaryContact: true,
              isSecondaryContact: false,
            },
          ],
        },
      },
      vendorId: portal?.vendorId ?? 0,
      isTemplate: true,
    },
  })

  const template = await db.template.create({
    data: {
      name: data.templateName,
      proposalHeading: portal?.proposalHeading ?? "",
      proposalSubheading: portal?.proposalSubheading ?? "",
      portalId: templatePortal.id,
    },
  })

  //attach to new portalTeamplate
  portal?.roadmapStages.map(
    async (roadmapStage) =>
      await db.roadmapStage.create({
        data: {
          portalId: templatePortal.id,
          heading: roadmapStage.heading,
          date: roadmapStage.date,
          templateId: template.id,
        },
      })
  )

  portal?.images.map(
    async (image) =>
      await db.portalImage.create({
        data: {
          href: image.href,
          portalId: templatePortal.id,
          templateId: template.id,
        },
      })
  )

  portal?.nextStepsTasks.map(
    async (nextStepsTask) =>
      await db.nextStepsTask.create({
        data: {
          portalId: templatePortal.id,
          description: nextStepsTask.description,
          isCompleted: nextStepsTask.isCompleted,
          userId: userId,
          templateId: template.id,
        },
      })
  )

  portal?.productInfoSections.map(
    async (productInfoSection) =>
      await db.productInfoSection.create({
        data: {
          heading: productInfoSection.heading,
          portalId: templatePortal.id,
          templateId: template.id,
        },
      })
  )

  portal?.portalDocuments.map(
    async (portalDocument) =>
      await db.portalDocument.create({
        data: {
          linkId: portalDocument.linkId,
          portalId: templatePortal.id,
          templateId: template.id,
        },
      })
  )

  portal?.internalNotes.map(
    async (internalNote) =>
      await db.internalNote.create({
        data: {
          message: internalNote.message,
          userId: userId,
          portalId: templatePortal.id,
          templateId: template.id,
        },
      })
  )

  // userPortals:         UserPortal[]
})
