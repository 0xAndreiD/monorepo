import { NotFoundError, resolver } from "blitz"
import db, { EventType, Role } from "db"
import { z } from "zod"
import { Device, Link } from "../../../types"
import { getExternalUploadPath } from "../../core/util/upload"
import UAParser from "ua-parser-js"
import { getLocation } from "../../core/util/location"
import { StakeholderActivityEvent } from "app/core/components/portalDetails/StakeholderActivityLogCard"

const GetPortalDetail = z.object({
  // This accepts type of undefined, but is required at runtime
  portalId: z.number().optional().refine(Boolean, "Required"),
})

export default resolver.pipe(resolver.zod(GetPortalDetail), resolver.authorize(), async ({ portalId }) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const portal = await db.portal.findFirst({
    where: { id: portalId },
    include: {
      roadmapStages: true,
      vendor: true,
      documents: { orderBy: { id: "asc" } },
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

  if (!portal) throw new NotFoundError()

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
      ctaLink: stage.ctaLinkText && stage.ctaLink ? { body: stage.ctaLinkText, href: stage.ctaLink } : undefined,
    })),
  }

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
           JOIN "UserPortal" UP ON E."userId" = UP."userId" AND E."portalId" = UP."portalId" AND UP.role = 'Stakeholder'
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
           JOIN "UserPortal" UP ON E."userId" = UP."userId" AND E."portalId" = UP."portalId" AND UP.role = 'Stakeholder'
    WHERE E."portalId" = ${portalId}
    GROUP BY E."userId"
    ORDER BY "eventCount" DESC;
  `

  const stakeholderActivityLogRaw = await db.$queryRaw<DenormalizedEvent[]>`
    SELECT U."firstName" || ' ' || U."lastName" AS "stakeholderName",
           P."customerName",
           E.type,
           D.title                              AS "documentTitle",
           D.path                               AS "documentPath",
           E.url,
           E.ip,
           E."userAgent",
           E."createdAt"
    FROM "Event" E
           JOIN "UserPortal" UP ON E."userId" = UP."userId" AND E."portalId" = UP."portalId" AND UP.role = 'Stakeholder'
           JOIN "User" U on U.id = E."userId"
           JOIN "Portal" P on E."portalId" = P.id
           LEFT JOIN "Document" D ON E."documentId" = D.id
    WHERE E."portalId" = ${portalId}
    ORDER BY E."createdAt" DESC
    LIMIT 25
  `
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

export type DenormalizedEvent = {
  stakeholderName: string
  customerName: string
  type: EventType
  documentTitle: string
  documentPath: string
  url: string
  ip: string
  userAgent: string
  createdAt: string
}

export function generateLinkFromEventType(event: {
  type: EventType
  documentTitle: string
  documentPath: string
}): Link | null {
  switch (event.type) {
    case EventType.LaunchRoadmapLinkOpen:
      return null //TODO: have actual link
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
      return { body: event.documentTitle, href: getExternalUploadPath(event.documentPath) }
    case EventType.DocumentUpload:
      return { body: event.documentTitle, href: getExternalUploadPath(event.documentPath) }
    case EventType.ProposalApprove:
      return null
    case EventType.ProposalDecline:
      return null
    case EventType.ProposalOpen:
      return { body: "the proposal", href: getExternalUploadPath(event.documentPath) }
    case EventType.CreateInternalMessage:
      return null
    case EventType.ProductInfoLinkOpen:
      return null //TODO: have actual link
    case EventType.InviteStakeholder:
      return null
  }
}
