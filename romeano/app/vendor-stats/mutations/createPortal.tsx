import CustomerPortal from "app/pages/customerPortals/[portalId]"
import { AuthenticationError, resolver, useMutation } from "blitz"
import { de } from "date-fns/locale"
import db, { LinkType, Role } from "db"
import { debuglog } from "util"
import { z } from "zod"
import createStakeholder from "app/customer-portals/mutations/createStakeholder"

import { encodeHashId } from "../../core/util/crypto"

export const CreatePortal = z.object({
  oppName: z.string(),
  customerFName: z.string(),
  customerLName: z.string(),
  customerEmail: z.string(),
  roleName: z.string(),
  templateId: z.string(),
})

export default resolver.pipe(resolver.zod(CreatePortal), resolver.authorize(), async (data, ctx) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const userId = ctx.session.userId
  if (!userId) throw new AuthenticationError("no userId provided")

  // const [inviteStakeholderMutation] = useMutation(createStakeholder)

  const user = await db.user.findUnique({ where: { id: userId } })
  const accountExec = await db.accountExecutive.findUnique({ where: { userId: userId } })
  if (!accountExec) throw new AuthenticationError("Portal can only be created by an AE")

  const vendorTeam = await db.vendorTeam.findUnique({ where: { id: accountExec.vendorTeamId } })
  if (!vendorTeam) throw new AuthenticationError("No vendor team associated w AE when creating portal")

  const existingCustomer = await db.user.findUnique({ where: { email: data.customerEmail } })
  var portal

  var id = 0

  //check if this customer already exists, if not, make a new stakeholder for them for them
  if (!existingCustomer) {
    const newCustomer = await db.user.create({
      data: {
        firstName: data.customerFName,
        lastName: data.customerLName,
        email: data.customerEmail,

        //create the stakeholder data info
        stakeholder: {
          create: {
            jobTitle: data.roleName,
          },
        },
      },
    })

    portal = await db.portal.create({
      data: {
        customerName: data.oppName,
        customerLogoUrl: "",
        currentRoadmapStage: 1,
        userPortals: {
          createMany: {
            data: [
              {
                userId: userId,
                role: Role.AccountExecutive,
                isPrimaryContact: true,
                isSecondaryContact: false,
              },
              {
                userId: newCustomer.id,
                role: Role.Stakeholder,
                isPrimaryContact: true,
              },
            ],
          },
        },
        //temp until updated below
        proposalHeading: "",
        proposalSubheading: "",
        vendorId: vendorTeam.vendorId,
      },
    })

    // await inviteStakeholderMutation({
    //   portalId: encodeHashId(portal.id),
    //   email: data.customerEmail,
    //   fullName: data.customerFName + " " + data.customerLName,
    //   jobTitle: data.roleName,
    // })

    id = portal.id
  } else {
    portal = await db.portal.create({
      data: {
        customerName: data.oppName,
        customerLogoUrl: "",
        currentRoadmapStage: 1,
        userPortals: {
          createMany: {
            data: [
              {
                userId: userId,
                role: Role.AccountExecutive,
                isPrimaryContact: true,
                isSecondaryContact: false,
              },
              {
                userId: existingCustomer.id,
                role: Role.Stakeholder,
                isPrimaryContact: true,
              },
            ],
          },
        },
        //temp until updated below
        proposalHeading: "",
        proposalSubheading: "",
        vendorId: vendorTeam.vendorId,
      },
    })

    id = portal.id
  }

  // await inviteStakeholderMutation({
  //   portalId: encodeHashId(portal.id),
  //   email: data.customerEmail,
  //   fullName: data.customerFName + " " + data.customerLName,
  //   jobTitle: data.roleName,
  // })

  //if a template was sent with this request
  if (data.templateId != "") {
    const template = await db.template.findUnique({
      where: { id: parseInt(data.templateId) },
      include: {
        roadmapStages: {
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

    //update headings and subheadings
    await db.portal.update({
      where: {
        id: id,
      },
      data: {
        proposalHeading: template?.proposalHeading ?? "",
        proposalSubheading: template?.proposalSubheading ?? "",
      },
    })

    template?.roadmapStages.map(async (roadmapStage) => {
      const link = await db.link.create({
        data: {
          body: roadmapStage.ctaLink?.body ?? "",
          href: roadmapStage.ctaLink?.href ?? "",
          type: roadmapStage.ctaLink?.type ?? LinkType.Document,
          userId: userId,
        },
      })

      await db.roadmapStage.create({
        data: {
          heading: roadmapStage.heading,
          date: roadmapStage.date,
          tasks: roadmapStage.tasks,
          portalId: id,
          ctaLinkId: link.id,
        },
      })
    })

    template?.nextStepsTasks.map(
      async (nextStepsTask) =>
        await db.nextStepsTask.create({
          data: {
            description: nextStepsTask.description,
            isCompleted: nextStepsTask.isCompleted,
            userId: userId,
            portalId: id,
          },
        })
    )

    template?.images.map(
      async (image) =>
        await db.portalImage.create({
          data: {
            href: image.href,
            portalId: id,
          },
        })
    )

    if (template?.productInfoSections) {
      for (var i = 0; i < template?.productInfoSections.length; i++) {
        const productInfoSection = template?.productInfoSections[i]

        const section = await db.productInfoSection.create({
          data: {
            heading: productInfoSection.heading,
            portalId: id,
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
            },
          })

          await db.productInfoSectionLink.create({
            data: {
              linkId: thisLink.id,
              productInfoSectionId: section.id,
            },
          })
        }
      }
    }

    //need to duplicate the links as well
    template?.portalDocuments.map(async (portalDocument) => {
      const link = await db.link.create({
        data: {
          body: portalDocument.link?.body ?? "",
          href: portalDocument.link?.href ?? "",
          type: portalDocument.link?.type ?? LinkType.Document,
          userId: userId,
        },
      })

      await db.portalDocument.create({
        data: {
          linkId: link.id,
          portalId: id,
        },
      })
    })

    template?.internalNotes.map(
      async (internalNote) =>
        await db.internalNote.create({
          data: {
            message: internalNote.message,
            userId: userId,
            portalId: id,
          },
        })
    )
  }

  return portal
})
