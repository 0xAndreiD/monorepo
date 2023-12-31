import { AuthenticationError, Document, resolver } from "blitz"
import db, { LinkType, Role, ProductInfoSection } from "db"
import { debuglog } from "util"
import { z } from "zod"
import { encodeHashId, decodeHashId } from "../../core/util/crypto"

export const SaveTemplate = z.object({
  portalId: z.string(),
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
      id: decodeHashId(data.portalId),
    },
    include: {
      roadmapStages: {
        include: {
          ctaLink: true,
        },
        orderBy: {
          createdAt: "asc",
        },
      },
      nextStepsTasks: true,
      images: true,
      productInfoSections: {
        include: {
          productInfoSectionLink: {
            include: {
              link: true,
            },
          },
        },
      },
      portalDocuments: {
        include: {
          link: true,
        },
      },
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
      // userPortals: {
      //   createMany: {
      //     data: [
      //       {
      //         userId: userId,
      //         role: Role.AccountExecutive,
      //         isPrimaryContact: true,
      //         isSecondaryContact: false,
      //       },
      //     ],
      //   },
      // },
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
      vendorId: ctx.session.vendorId,
    },
  })

  await db.userPortal.create({
    data: {
      userId: userId,
      role: Role.AccountExecutive,
      isPrimaryContact: true,
      isSecondaryContact: false,
      portalId: templatePortal.id,
      templateId: template.id,
      vendorId: ctx.session.vendorId,
    },
  })

  if (portal?.roadmapStages) {
    for (var i = 0; i < portal?.roadmapStages.length; i++) {
      const roadmapStage = portal?.roadmapStages[i]

      const link = await db.link.create({
        data: {
          body: roadmapStage.ctaLink?.body ?? "",
          href: roadmapStage.ctaLink?.href ?? "",
          type: roadmapStage.ctaLink?.type ?? LinkType.Document,
          userId: userId,
          vendorId: ctx.session.vendorId,
        },
      })

      await db.roadmapStage.create({
        data: {
          portalId: templatePortal.id,
          vendorId: ctx.session.vendorId,
          heading: roadmapStage.heading,
          date: roadmapStage.date,
          templateId: template.id,
          tasks: roadmapStage.tasks,
          ctaLinkId: link.id,
        },
      })
    }
  }

  portal?.images?.map(
    async (image) =>
      await db.portalImage.create({
        data: {
          href: image.href,
          portalId: templatePortal.id,
          vendorId: ctx.session.vendorId,
          templateId: template.id,
        },
      })
  )

  portal?.nextStepsTasks?.map(
    async (nextStepsTask) =>
      await db.nextStepsTask.create({
        data: {
          portalId: templatePortal.id,
          vendorId: ctx.session.vendorId,
          description: nextStepsTask.description,
          isCompleted: nextStepsTask.isCompleted,
          userId: userId,
          templateId: template.id,
        },
      })
  )

  if (portal?.productInfoSections) {
    for (var i = 0; i < portal?.productInfoSections.length; i++) {
      const productInfoSection = portal?.productInfoSections[i]

      const section = await db.productInfoSection.create({
        data: {
          heading: productInfoSection.heading,
          vendorId: ctx.session.vendorId,
          portalId: templatePortal.id,
          templateId: template.id,
        },
      })

      //extract the info neccesary to create productInfoSectionLinks
      var linkData = productInfoSection.productInfoSectionLink

      for (let link of linkData) {
        const thisLink = await db.link.create({
          data: {
            body: link.link.body ?? "",
            href: link.link.href ?? "",
            type: link.link?.type ?? LinkType.Document,
            userId: userId,
            vendorId: ctx.session.vendorId,
          },
        })

        await db.productInfoSectionLink.create({
          data: {
            linkId: thisLink.id,
            productInfoSectionId: section.id,
            vendorId: ctx.session.vendorId,
          },
        })
      }
    }
  }

  portal?.portalDocuments?.map(async (portalDocument) => {
    const link = await db.link.create({
      data: {
        body: portalDocument.link?.body ?? "",
        href: portalDocument.link?.href ?? "",
        type: portalDocument.link?.type ?? LinkType.Document,
        userId: userId,
        vendorId: ctx.session.vendorId,
      },
    })

    await db.portalDocument.create({
      data: {
        linkId: link.id,
        portalId: templatePortal.id,
        templateId: template.id,
        vendorId: ctx.session.vendorId,
      },
    })
  })

  portal?.internalNotes?.map(
    async (internalNote) =>
      await db.internalNote.create({
        data: {
          message: internalNote.message,
          userId: userId,
          portalId: templatePortal.id,
          templateId: template.id,
          vendorId: ctx.session.vendorId,
        },
      })
  )

  // userPortals:         UserPortal[]
  return {
    portalId: encodeHashId(template.portalId),
    templateName: template.name,
  }
})
