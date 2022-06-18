import CustomerPortal from "app/pages/customerPortals/[portalId]"
import { AuthenticationError, resolver } from "blitz"
import { de } from "date-fns/locale"
import db, { LinkType, Role } from "db"
import { debuglog } from "util"
import { z } from "zod"

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

  //if a template was sent with this request
  if (data.templateId != "") {
    const template = await db.template.findUnique({
      where: { id: parseInt(data.templateId) },
      include: {
        roadmapStages: true,
        nextStepsTasks: true,
        images: true,
        productInfoSections: true,
        portalDocuments: true,
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

    template?.roadmapStages.map(
      async (roadmapStage) =>
        await db.roadmapStage.create({
          data: {
            heading: roadmapStage.heading,
            date: roadmapStage.date,
            tasks: roadmapStage.tasks,
            portalId: id,
          },
        })
    )

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

    //this will not bring over the product info section links
    template?.productInfoSections.map(
      async (productInfoSection) =>
        await db.productInfoSection.create({
          data: {
            heading: productInfoSection.heading,
            portalId: id,
          },
        })
    )

    //need to duplicate the links as well
    template?.portalDocuments.map(
      async (portalDocument) =>
        await db.portalDocument.create({
          data: {
            linkId: portalDocument.linkId,
            portalId: id,
          },
        })
    )

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
