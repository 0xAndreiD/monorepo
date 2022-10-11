import { AuthenticationError, resolver } from "blitz"
import db, { LinkType, Role } from "db"
import { z } from "zod"

export const CreatePortal = z.object({
  oppName: z.string().nonempty(),
  customerFName: z.string(),
  customerLName: z.string(),
  customerEmail: z.string(),
  roleName: z.string(),
  templateId: z.string(),
})

export default resolver.pipe(resolver.zod(CreatePortal), resolver.authorize(), async (data, ctx) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const userId = ctx.session.userId
  if (!userId) throw new AuthenticationError("No userId found in session")

  const user = await db.user.findUnique({ where: { id: userId } })
  if (!user) throw new AuthenticationError("User not found")

  const accountExec = await db.accountExecutive.findUnique({ where: { userId: userId } })
  if (!accountExec) throw new AuthenticationError("Portal can only be created by an AE")

  const vendorTeam = await db.vendorTeam.findUnique({ where: { id: accountExec.vendorTeamId } })
  if (!vendorTeam) throw new AuthenticationError("No vendor team associated with AE when creating portal")

  let emailUser = null
  if (data.customerEmail) {
    emailUser = await db.user.findUnique({
      where: {
        email_vendorId: { email: data.customerEmail, vendorId: ctx.session.vendorId },
      },
    })

    //check if user with this email already exists, if not, make a new stakeholder for them
    if (!emailUser) {
      emailUser = await db.user.create({
        data: {
          firstName: data.customerFName,
          lastName: data.customerLName,
          email: data.customerEmail,
          vendorId: user.vendorId,
          //create the stakeholder data info
          stakeholder: {
            create: {
              jobTitle: data.roleName,
              vendorId: user.vendorId,
            },
          },
        },
      })
    }
  }

  var portal
  var id = 0

  console.log("TEMPLATE ID", data.templateId)
  var template = null
  // load template if a template was sent with this request
  if (data.templateId != "") {
    template = await db.template.findUnique({
      where: { id: parseInt(data.templateId) },
      include: {
        roadmapStages: {
          orderBy: {
            date: "asc",
          },
          include: {
            ctaLink: true,
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
  }
  console.log("template", template)

  if (emailUser && emailUser.id) {
    portal = await db.portal.create({
      data: {
        customerName: data.oppName,
        customerLogoUrl: "",
        currentRoadmapStage: 1,
        vendorId: vendorTeam.vendorId,
        userPortals: {
          createMany: {
            data: [
              {
                userId: userId,
                vendorId: vendorTeam.vendorId,
                role: Role.AccountExecutive,
                isPrimaryContact: true,
                isSecondaryContact: false,
              },
              {
                userId: emailUser.id,
                vendorId: vendorTeam.vendorId,
                role: Role.Stakeholder,
                isPrimaryContact: true,
                isSecondaryContact: false,
              },
            ],
          },
        },
        proposalHeading: template?.proposalHeading ?? "",
        proposalSubheading: template?.proposalSubheading ?? "",
      },
    })
  } else {
    portal = await db.portal.create({
      data: {
        customerName: data.oppName,
        customerLogoUrl: "",
        currentRoadmapStage: 1,
        vendorId: vendorTeam.vendorId,
        userPortals: {
          create: {
            userId: userId,
            vendorId: vendorTeam.vendorId,
            role: Role.AccountExecutive,
            isPrimaryContact: true,
            isSecondaryContact: false,
          },
        },
        proposalHeading: template?.proposalHeading ?? "",
        proposalSubheading: template?.proposalSubheading ?? "",
      },
    })
  }
  id = portal.id

  if (template) {
    // Load everything from template portal
    const templatePortal = await db.portal.findFirst({
      where: {
        id: template.portalId,
        vendorId: ctx.session.vendorId,
      },
      include: {
        roadmapStages: {
          orderBy: {
            date: "asc",
          },
          include: {
            ctaLink: true,
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
    console.log("templatePortal", templatePortal)

    if (templatePortal?.roadmapStages) {
      for (var i = 0; i < templatePortal?.roadmapStages.length; i++) {
        const roadmapStage = templatePortal?.roadmapStages[i]

        const link = await db.link.create({
          data: {
            body: roadmapStage.ctaLink?.body ?? "",
            href: roadmapStage.ctaLink?.href ?? "",
            type: roadmapStage.ctaLink?.type ?? LinkType.Document,
            userId: userId,
            vendorId: vendorTeam.vendorId,
          },
        })

        await db.roadmapStage.create({
          data: {
            portalId: id,
            heading: roadmapStage.heading,
            date: roadmapStage.date,
            tasks: roadmapStage.tasks,
            ctaLinkId: link.id,
            vendorId: vendorTeam.vendorId,
          },
        })
      }
    }

    templatePortal?.nextStepsTasks.map(
      async (nextStepsTask) =>
        await db.nextStepsTask.create({
          data: {
            description: nextStepsTask.description,
            isCompleted: nextStepsTask.isCompleted,
            userId: userId,
            portalId: id,
            vendorId: vendorTeam.vendorId,
          },
        })
    )

    templatePortal?.images.map(
      async (image) =>
        await db.portalImage.create({
          data: {
            href: image.href,
            portalId: id,
            vendorId: vendorTeam.vendorId,
          },
        })
    )

    if (templatePortal?.productInfoSections) {
      for (var i = 0; i < templatePortal?.productInfoSections.length; i++) {
        const productInfoSection = templatePortal?.productInfoSections[i]

        const section = await db.productInfoSection.create({
          data: {
            heading: productInfoSection.heading,
            portalId: id,
            vendorId: vendorTeam.vendorId,
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
              vendorId: vendorTeam.vendorId,
            },
          })

          await db.productInfoSectionLink.create({
            data: {
              linkId: thisLink.id,
              productInfoSectionId: section.id,
              vendorId: vendorTeam.vendorId,
            },
          })
        }
      }
    }

    //need to duplicate the links as well
    templatePortal?.portalDocuments.map(async (portalDocument) => {
      const link = await db.link.create({
        data: {
          body: portalDocument.link?.body ?? "",
          href: portalDocument.link?.href ?? "",
          type: portalDocument.link?.type ?? LinkType.Document,
          userId: userId,
          vendorId: vendorTeam.vendorId,
        },
      })

      await db.portalDocument.create({
        data: {
          linkId: link.id,
          portalId: id,
          vendorId: vendorTeam.vendorId,
        },
      })
    })

    templatePortal?.internalNotes.map(
      async (internalNote) =>
        await db.internalNote.create({
          data: {
            message: internalNote.message,
            userId: userId,
            portalId: id,
            vendorId: vendorTeam.vendorId,
          },
        })
    )

    await db.portal.update({
      where: {
        id: portal.id,
      },
      data: {
        proposalHeading: templatePortal?.proposalHeading,
        proposalSubheading: templatePortal?.proposalSubheading,
      },
    })
    //need to duplicate the proposal links as well
    const proposalLink = templatePortal?.proposalLinkId
      ? await db.link.findFirst({
          where: {
            id: templatePortal.proposalLinkId,
          },
        })
      : null
    console.log("Proposal Link", proposalLink)
    if (proposalLink) {
      const link = await db.link.create({
        data: {
          body: proposalLink?.body ?? "",
          href: proposalLink?.href ?? "",
          type: proposalLink?.type ?? LinkType.Document,
          userId: userId,
          vendorId: vendorTeam.vendorId,
        },
      })
      if (link) {
        await db.portal.update({
          where: {
            id: portal.id,
          },
          data: {
            proposalLinkId: link.id,
          },
        })
      }
    }
  }

  return portal
})
