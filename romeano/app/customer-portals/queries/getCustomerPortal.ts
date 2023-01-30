import { AuthenticationError, NotFoundError, resolver, Ctx, AuthorizationError } from "blitz"
import db, { EventType, Portal, Role, UserPortal } from "db"
import { orderBy } from "lodash"
import { z } from "zod"
import { Stakeholder } from "../../core/components/customerPortals/ProposalCard"
import { getDocuments } from "../../portal-details/queries/getPortalDetail"
import { formatLink } from "../../core/util/upload"
import { LinkWithId } from "../../../types"
import { invoke } from "blitz"

import { decodeHashId, encodeHashId } from "../../core/util/crypto"
import getCurrentUser from "app/users/queries/getCurrentUser"
import createEvent from "app/event/mutations/createEvent"

const GetCustomerPortal = z.object({
  // This accepts type of undefined, but is required at runtime
  portalId: z.string().refine(Boolean, "Required"),
})

export function checkIfUserCanAccessPortal(
  ctx: Ctx,
  portal: Portal & { userPortals: UserPortal[] },
  checkIfCanEdit: boolean
) {
  const userId = ctx.session.userId
  if (!userId) throw new AuthenticationError("no userId provided")

  if (!portal) throw new NotFoundError("Portal not found")

  const accountExecutiveIds = new Set(
    portal.userPortals?.filter((x) => x.role === Role.AccountExecutive).map((x) => x.userId)
  )
  const stakeholderIds = new Set(portal.userPortals?.filter((x) => x.role === Role.Stakeholder).map((x) => x.userId))
  console.log("Verifying USER ACCESS TO PORTAL", userId, accountExecutiveIds, stakeholderIds)

  if (!accountExecutiveIds?.has(userId) && !stakeholderIds?.has(userId) && !portal.isGlobal) {
    throw new AuthorizationError("User does not have access to the requested portal")
  }

  if (checkIfCanEdit && !accountExecutiveIds?.has(userId)) {
    throw new AuthorizationError("User is not an AE on portal and hence cannot edit")
  }
}

export default resolver.pipe(resolver.zod(GetCustomerPortal), resolver.authorize(), async ({ portalId }, ctx: Ctx) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const portalIdInt = decodeHashId(portalId)
  if (!portalIdInt) throw new NotFoundError()

  const currentUser = await getCurrentUser({}, ctx)

  const portal = await db.portal.findUnique({
    where: { id: portalIdInt },
    include: {
      proposalLink: true,
      roadmapStages: {
        include: {
          ctaLink: true,
        },
        orderBy: [{ portalId: "asc" }, { id: "asc" }],
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
      productInfoSections: {
        include: {
          productInfoSectionLink: {
            include: { link: true },
            orderBy: { id: "asc" },
          },
        },
        orderBy: { id: "asc" },
      },
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
  checkIfUserCanAccessPortal(ctx, portal, false)

  const accountExecutiveIds = new Set(
    portal.userPortals.filter((x) => x.role === Role.AccountExecutive).map((x) => x.userId)
  )
  const stakeholderIds = new Set(portal.userPortals.filter((x) => x.role === Role.Stakeholder).map((x) => x.userId))

  const header = {
    vendorLogo: portal.vendor.logoUrl,
    customerName: portal.customerName,
    customerLogo: portal.customerLogoUrl,
  }

  const template = portal.isTemplate
    ? await db.template.findFirst({
        where: {
          vendorId: ctx.session.vendorId,
          portalId: portal.id,
        },
      })
    : null

  const launchRoadmap = {
    currentRoadmapStage: portal.currentRoadmapStage,
    stages: portal.roadmapStages.map((stage) => ({
      id: stage.id,
      heading: stage.heading,
      date: stage.date?.toISOString(),
      tasks: stage.tasks,
      ctaLink: stage.ctaLink ? { ...stage.ctaLink, href: formatLink(stage.ctaLink) } : undefined,
    })),
  }

  const nextSteps = {
    customer: {
      name: portal.customerName,
      tasks: portal.nextStepsTasks
        .filter((x) => !x.isForVendor && accountExecutiveIds.has(x.userId))
        .map((x) => ({
          id: x.id,
          description: x.description,
          isCompleted: x.isCompleted,
          userId: x.userId,
        })),
    },
    vendor: {
      name: portal.vendor.name,
      tasks: portal.nextStepsTasks
        .filter((x) => x.isForVendor || stakeholderIds.has(x.userId))
        .map((x) => ({
          id: x.id,
          description: x.description,
          isCompleted: x.isCompleted,
          userId: x.userId,
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
        href: formatLink(sectionLink.link),
        type: sectionLink.link.type, //need type for link editing handling
        productInfoSectionLinkId: sectionLink.id, //needed for updating links
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
          href: formatLink(portal.proposalLink),
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

  // Track portal open event if user is stakeholder
  if (currentUser.stakeholder) {
    invoke(createEvent, { type: EventType.StakeholderPortalOpen, portalId: portalId })
  }
  return {
    ...portal,
    template,
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
