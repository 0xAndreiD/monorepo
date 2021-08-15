import { NotFoundError, resolver } from "blitz"
import db, { Role } from "db"
import { orderBy } from "lodash"
import { z } from "zod"
import { getExternalUploadPath } from "../../core/util/upload"
import { Stakeholder } from "../../core/components/customerPortals/ProposalCard"

const GetCustomerPortal = z.object({
  // This accepts type of undefined, but is required at runtime
  portalId: z.number().optional().refine(Boolean, "Required"),
})

export default resolver.pipe(resolver.zod(GetCustomerPortal), resolver.authorize(), async ({ portalId }) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const portal = await db.portal.findFirst({
    where: { id: portalId },
    include: {
      proposalDocument: true,
      proposalLink: true,
      roadmapStages: {
        include: {
          tasks: true, //get the associated tasks for a stage
          ctaLink: true,
        },
        orderBy: { id: "asc" },
      },
      nextStepsTasks: {
        include: {
          portal: {
            include: { userPortals: true },
          },
        },
        orderBy: { id: "asc" },
      },
      vendor: true,
      documents: { orderBy: { id: "asc" } },
      images: { orderBy: { id: "asc" } },
      productInfoSections: { include: { productInfoSectionLink: { include: { link: true } } } },
      userPortals: {
        include: {
          user: {
            include: {
              accountExecutive: true,
              stakeholder: true,
            },
          },
        },
        orderBy: { userId: "asc" },
      },
      internalNotes: true,
    },
  })

  if (!portal) throw new NotFoundError()

  const header = {
    vendorLogo: portal.vendor.logoUrl,
    customerName: portal.customerName,
    customerLogo: portal.customerLogoUrl,
  }

  const launchRoadmap = {
    currentRoadmapStage: portal.currentRoadmapStage,
    stages: portal.roadmapStages.map((stage) => ({
      heading: stage.heading,
      date: stage.date?.toISOString(),
      tasks: stage.tasks.map((task) => task.task),
      ctaLink: stage.ctaLink,
    })),
  }

  const accountExecutives = new Set(
    portal.userPortals.filter((x) => x.role === Role.AccountExecutive).map((x) => x.userId)
  )
  const stakeholders = new Set(portal.userPortals.filter((x) => x.role === Role.Stakeholder).map((x) => x.userId))

  const nextSteps = {
    customer: {
      name: portal.customerName,
      tasks: portal.nextStepsTasks
        .filter((x) => accountExecutives.has(x.userId))
        .map((x) => ({
          id: x.id,
          description: x.description,
          isCompleted: x.isCompleted,
        })),
    },
    vendor: {
      name: portal.vendor.name,
      tasks: portal.nextStepsTasks
        .filter((x) => stakeholders.has(x.userId))
        .map((x) => ({
          id: x.id,
          description: x.description,
          isCompleted: x.isCompleted,
        })),
    },
  }

  const documents = {
    customer: {
      name: portal.customerName,
      documents: portal.documents
        .filter((x) =>
          portal.userPortals
            .filter((up) => up.role === Role.AccountExecutive)
            .map((up) => up.userId)
            .includes(x.userId)
        )
        .map((x) => ({
          id: x.id,
          title: x.title,
          href: getExternalUploadPath(x.path),
          isCompleted: x.isCompleted,
        })),
    },
    vendor: {
      name: portal.vendor.name,
      documents: portal.documents
        .filter((x) =>
          portal.userPortals
            .filter((up) => up.role === Role.Stakeholder)
            .map((up) => up.userId)
            .includes(x.userId)
        )
        .map((x) => ({
          id: x.id,
          title: x.title,
          href: getExternalUploadPath(x.path),
          isCompleted: x.isCompleted,
        })),
    },
  }

  const productInfo = {
    images: portal.images.map((x) => x.href),
    sections: portal.productInfoSections.map((section) => ({
      heading: section.heading,
      links: section.productInfoSectionLink.map((x) => ({
        id: x.link.id,
        body: x.link.body,
        href: x.link.href,
      })),
    })),
  }

  const proposal: {
    heading: string
    subheading: string
    quote:
      | { proposalType: "document"; documentId: number; body: string; href: string }
      | { proposalType: "link"; linkId: number; body: string; href: string }
      | null
    stakeholders: Stakeholder[]
  } = {
    heading: portal.proposalHeading,
    subheading: portal.proposalSubheading,
    quote:
      portal.proposalType === "document" && portal.proposalDocument
        ? {
            proposalType: "document",
            documentId: portal.proposalDocument.id,
            body: portal.proposalDocument.title,
            href: getExternalUploadPath(portal.proposalDocument.path),
          }
        : portal.proposalType === "link" && portal.proposalLink
        ? {
            proposalType: "link",
            linkId: portal.proposalLink.id,
            body: portal.proposalLink.body,
            href: portal.proposalLink.href,
          }
        : null,
    stakeholders: portal.userPortals
      .filter((userPortal) => userPortal.role === Role.Stakeholder)
      .map((userPortal) => ({
        firstName: userPortal.user.firstName,
        lastName: userPortal.user.lastName,
        jobTitle: userPortal.user.stakeholder?.jobTitle,
        email: userPortal.user.email,
        hasStakeholderApproved: userPortal.hasStakeholderApproved,
      })),
  }

  const aeContacts = orderBy(
    portal.userPortals.filter(
      (userPortal) =>
        userPortal.role === Role.AccountExecutive &&
        (userPortal.isPrimaryContact === true || userPortal.isSecondaryContact === true)
    ),
    ["isPrimaryContact", "isSecondaryContact"],
    ["desc", "desc"]
  )

  const contacts = {
    contacts: aeContacts.map((userPortal) => ({
      firstName: userPortal.user.firstName,
      lastName: userPortal.user.lastName,
      jobTitle: userPortal.user.accountExecutive?.jobTitle,
      email: userPortal.user.email,
      photoUrl: userPortal.user.photoUrl,
    })),
  }

  const internalNotes = {
    messages: portal.internalNotes.map((x) => ({
      id: x.id,
      userId: x.userId,
      body: x.message,
      timestamp: x.createdAt.toISOString(),
    })),
    users: portal.userPortals
      .filter((userPortal) => userPortal.role === Role.Stakeholder)
      .map((userPortal) => ({
        id: userPortal.userId,
        firstName: userPortal.user.firstName,
        lastName: userPortal.user.lastName,
      })),
  }

  return {
    header,
    launchRoadmap,
    nextSteps,
    documents,
    productInfo,
    proposal,
    contacts,
    internalNotes,
  }
})
