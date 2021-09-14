import { NotFoundError, resolver } from "blitz"
import db, { EventType, Link, LinkType, PortalDocument, Role, UserPortal } from "db"
import { z } from "zod"
import { Device, Link as FELink } from "../../../types"
import { formatLink, getExternalUploadPath } from "../../core/util/upload"
import UAParser from "ua-parser-js"
import { getLocation } from "../../core/util/location"
import { StakeholderActivityEvent } from "app/core/components/portalDetails/StakeholderActivityLogCard"
import { getStakeholderActivityLogRaw } from "../../vendor-stats/queries/getVendorStats"

const GetPortalDetail = z.object({
  // This accepts type of undefined, but is required at runtime
  portalId: z.number().optional().refine(Boolean, "Required"),
})

export function getDocuments(
  portalDocuments: (PortalDocument & { link: Link })[],
  userPortals: UserPortal[],
  role: Role
) {
  return portalDocuments
    .filter((x) =>
      userPortals
        .filter((up) => up.role === role)
        .map((up) => up.userId)
        .includes(x.link.userId)
    )
    .map((x) => ({
      id: x.link.id,
      body: x.link.body,
      href: getExternalUploadPath(x.link.href),
      isCompleted: role === Role.Stakeholder, //FIXME: should make this actually check
    }))
}

export default resolver.pipe(resolver.zod(GetPortalDetail), resolver.authorize(), async ({ portalId }) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const portal = await db.portal.findUnique({
    where: { id: portalId },
    include: {
      roadmapStages: {
        include: { ctaLink: true },
        orderBy: { id: "asc" },
      },
      vendor: true,
      portalDocuments: {
        include: { link: true },
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
      },
    },
  })

  if (!portalId || !portal) throw new NotFoundError()

  const header = {
    vendorLogo: portal.vendor.logoUrl,
    customerName: portal.customerName,
    customerLogo: portal.customerLogoUrl,
  }

  const opportunityOverview = {
    currentRoadmapStage: portal.currentRoadmapStage,
    stages: portal.roadmapStages.map((stage) => ({
      heading: stage.heading,
      date: stage.date?.toISOString(),
      tasks: null,
      ctaLink: stage.ctaLink,
    })),
  }
  const foo = portal.userPortals

  const contacts = {
    contacts: portal.userPortals
      .filter((userPortal) => userPortal.role === Role.Stakeholder && userPortal.isPrimaryContact === true)
      .map((userPortal) => ({
        firstName: userPortal.user.firstName,
        lastName: userPortal.user.lastName,
        jobTitle: userPortal.user.stakeholder?.jobTitle,
        email: userPortal.user.email,
        photoUrl: userPortal.user.photoUrl,
      })),
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

  const overallEngagement = (
    await db.$queryRaw<
      Array<{
        timestamp: string
        eventCount: number
      }>
    >`
      SELECT DATE_TRUNC('day', E."createdAt") AS timestamp,
             COUNT(*)                         AS "eventCount"
      FROM "Event" E
             JOIN "UserPortal" UP
                  ON E."userId" = UP."userId" AND E."portalId" = UP."portalId" AND UP.role = 'Stakeholder'
      WHERE E."portalId" = ${portalId}
      GROUP BY TIMESTAMP
      ORDER BY TIMESTAMP ASC;
    `
  ).map((x) => ({ x: new Date(x.timestamp), y: x.eventCount }))

  const stakeholderEngagement = await db.$queryRaw<
    Array<{
      userId: number
      stakeholderName: string
      stakeholderJobTitle: string
      eventCount: number
      lastActive: string
    }>
  >`
    SELECT E."userId",
           (SELECT "firstName" || ' ' || "lastName" FROM "User" WHERE id = E."userId") AS "stakeholderName",
           (SELECT "jobTitle" FROM "Stakeholder" WHERE "userId" = E."userId")          AS "stakeholderJobTitle",
           COUNT(*)                                                                    AS "eventCount",
           (SELECT MAX("createdAt") FROM "Event" WHERE "userId" = E."userId")          AS "lastActive"
    FROM "Event" E
           JOIN "UserPortal" UP
                ON E."userId" = UP."userId" AND E."portalId" = UP."portalId" AND UP.role = 'Stakeholder'
    WHERE E."portalId" = ${portalId}
    GROUP BY E."userId"
    ORDER BY "eventCount" DESC;
  `

  const stakeholderActivityLogRaw = await getStakeholderActivityLogRaw([portalId])
  const stakeholderActivityLog: StakeholderActivityEvent[] = stakeholderActivityLogRaw.map((x) => ({
    stakeholderName: x.stakeholderName,
    customerName: x.customerName,
    type: x.type,
    link: generateLinkFromEventType(x),
    location: getLocation(x.ip),
    device: UAParser(x.userAgent).device.type === "mobile" ? Device.Mobile : Device.Computer,
    timestamp: new Date(x.createdAt).toISOString(),
  }))

  return {
    header,
    opportunityOverview,
    contacts,
    overallEngagement,
    documents,
    stakeholderEngagement,
    stakeholderActivityLog,
  }
})

export function generateLinkFromEventType(event: {
  type: EventType
  linkType: LinkType
  linkBody: string
  linkHref: string
}): FELink | null {
  switch (event.type) {
    case EventType.LaunchRoadmapLinkOpen:
      return { body: event.linkBody, href: event.linkHref }
    case EventType.NextStepCreate:
      return null
    case EventType.NextStepMarkCompleted:
      return null
    case EventType.NextStepMarkNotCompleted:
      return null
    case EventType.NextStepDelete:
      return null
    case EventType.DocumentApprove:
      return null
    case EventType.DocumentOpen:
      return { body: event.linkBody, href: getExternalUploadPath(event.linkHref) }
    case EventType.DocumentUpload:
      return { body: event.linkBody, href: getExternalUploadPath(event.linkHref) }
    case EventType.ProposalApprove:
      return null
    case EventType.ProposalDecline:
      return null
    case EventType.ProposalOpen:
      return { body: "the proposal", href: formatLink({ type: event.linkType, href: event.linkHref }) }
    case EventType.CreateInternalMessage:
      return null
    case EventType.ProductInfoLinkOpen:
      console.log("PILO", event)
      return { body: event.linkBody, href: formatLink({ type: event.linkType, href: event.linkHref }) }
    case EventType.InviteStakeholder:
      return null
  }
}
