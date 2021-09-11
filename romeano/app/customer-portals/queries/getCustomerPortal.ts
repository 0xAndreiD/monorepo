import { NotFoundError, resolver } from "blitz"
import db, { LinkType, Role } from "db"
import { orderBy } from "lodash"
import { z } from "zod"
import { Stakeholder } from "../../core/components/customerPortals/ProposalCard"
import { getDocuments } from "../../portal-details/queries/getPortalDetail"
import { getExternalUploadPath } from "../../core/util/upload"
import { LinkWithId } from "../../../types"

const GetCustomerPortal = z.object({
  // This accepts type of undefined, but is required at runtime
  portalId: z.number().optional().refine(Boolean, "Required"),
})

export default resolver.pipe(resolver.zod(GetCustomerPortal), resolver.authorize(), async ({ portalId }) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const portal = await db.portal.findFirst({
    where: { id: portalId },
    include: {
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
      portalDocuments: { include: { link: true }, orderBy: { id: "asc" } },
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
      documents: getDocuments(portal.portalDocuments, portal.userPortals, Role.AccountExecutive),
    },
    vendor: {
      name: portal.vendor.name,
      documents: getDocuments(portal.portalDocuments, portal.userPortals, Role.Stakeholder),
    },
  }

  const productInfo = {
    images: portal.images.map((img) => img.href),
    sections: portal.productInfoSections.map((section) => ({
      id: section.id,
      heading: section.heading,
      links: section.productInfoSectionLink.map((sectionLink) => ({
        id: sectionLink.link.id,
        body: sectionLink.link.body,
        href: sectionLink.link.href,
      })),
    })),
  }

  const proposal: {
    heading: string
    subheading: string
    quote: LinkWithId | null
    stakeholders: Stakeholder[]
  } = {
    heading: portal.proposalHeading,
    subheading: portal.proposalSubheading,
    quote: portal.proposalLink
      ? {
          id: portal.proposalLink.id,
          body: portal.proposalLink.body,
          href:
            portal.proposalLink.type === LinkType.Document
              ? getExternalUploadPath(portal.proposalLink.href)
              : portal.proposalLink.href,
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
