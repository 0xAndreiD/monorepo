import { NotFoundError, resolver } from "blitz"
import db, { EventType, Role } from "db"
import { z } from "zod"
import { Device, Link } from "../../../types"
import { getBackendFilePath } from "../../core/util/upload"
import UAParser from "ua-parser-js"
import { getLocation } from "../../core/util/location"
import { StakeholderActivityEvent } from "app/core/components/portalDetails/StakeholderActivityLogCard"

const GetPortalDetail = z.object({
  // This accepts type of undefined, but is required at runtime
  portalId: z.number().optional().refine(Boolean, "Required")
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
              stakeholder: true
            }
          }
        }
      }
    }
  })

  if (!portal) throw new NotFoundError()

  const opportunityOverview = {
    currentRoadmapStage: portal.currentRoadmapStage,
    stages: portal.roadmapStages.map(stage => ({
      heading: stage.heading,
      date: stage.date?.toISOString(),
      ctaLink: stage.ctaLinkText && stage.ctaLink ? { body: stage.ctaLinkText, href: stage.ctaLink } : undefined
    }))
  }

  const contacts = {
    contacts: portal.userPortals
      .filter(userPortal => userPortal.role === Role.AccountExecutive)
      .map(userPortal =>
        ({
          firstName: userPortal.user.firstName,
          lastName: userPortal.user.lastName,
          jobTitle: userPortal.user.accountExecutive?.jobTitle,
          email: userPortal.user.email,
          photoUrl: userPortal.user.photoUrl ?? "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
        })
      )
  }

  const documents = {
    customer: {
      name: portal.customerName,
      documents: portal.documents
        .filter(x => portal.userPortals.filter(up => up.role === Role.AccountExecutive).map(up => up.userId).includes(x.userId))
        .map(x => ({
          id: x.id,
          title: x.title,
          href: getBackendFilePath(x.path),
          isCompleted: x.isCompleted
        }))
    },
    vendor: {
      name: portal.vendor.name,
      documents: portal.documents
        .filter(x => portal.userPortals.filter(up => up.role === Role.Stakeholder).map(up => up.userId).includes(x.userId))
        .map(x => ({
          id: x.id,
          title: x.title,
          href: getBackendFilePath(x.path),
          isCompleted: x.isCompleted
        }))
    }
  }

  const overallEngagement = (await db.$queryRaw<Array<{
    timestamp: string,
    eventCount: number
  }>>`
    SELECT DATE_TRUNC('day', "createdAt") AS timestamp,
           COUNT(*)                       AS "eventCount"
    FROM "Event"
    GROUP BY TIMESTAMP
    ORDER BY TIMESTAMP ASC;
  `).map(x => ({ x: new Date(x.timestamp), y: x.eventCount }))

  const stakeholderEngagement = await db.$queryRaw<Array<{
    userId: number,
    stakeholderName: string,
    stakeholderJobTitle: string,
    eventCount: number
    lastActive: string
  }>>`
    SELECT "userId",
           (SELECT "firstName" || ' ' || "lastName" FROM "User" WHERE id = "userId") AS "stakeholderName",
           (SELECT "jobTitle" FROM "Stakeholder" WHERE "userId" = "Event"."userId")  AS "stakeholderJobTitle",
           count(*)                                                                  AS "eventCount",
           (SELECT MAX("createdAt") FROM "Event" WHERE "userId" = "Event"."userId")  AS "lastActive"
    FROM "Event"
    WHERE "portalId" = ${portalId}
    GROUP BY "userId"
    ORDER BY "eventCount" DESC;
  `

  const stakeholderActivityLogRaw = await db.$queryRaw<DenormalizedEvent[]>`
    SELECT (SELECT "firstName" || ' ' || "lastName" FROM "User" WHERE id = E."userId") AS "stakeholderName",
           "customerName",
           type,
           title                                                                       AS "documentTitle",
           path                                                                        AS "documentPath",
           url,
           ip,
           "userAgent",
           E."createdAt"
    FROM "Event" E
           JOIN "Portal" P on E."portalId" = P.id
           LEFT JOIN "Document" D ON E."documentId" = D.id
    WHERE E."portalId" = ${portalId}
    ORDER BY E."createdAt" DESC
    LIMIT 25
  `
  const stakeholderActivityLog: StakeholderActivityEvent[] = stakeholderActivityLogRaw.map(x => ({
    stakeholderName: x.stakeholderName,
    customerName: x.customerName,
    type: x.type,
    link: generateLink(x),
    location: getLocation(x.ip),
    device: UAParser(x.userAgent).device.type === "mobile" ? Device.Mobile : Device.Computer,
    timestamp: new Date(x.createdAt).toISOString()
  }))

  return {
    opportunityOverview,
    contacts,
    overallEngagement,
    documents,
    stakeholderEngagement,
    stakeholderActivityLog
  }
})

type DenormalizedEvent = {
  stakeholderName: string,
  customerName: string,
  type: EventType,
  documentTitle: string,
  documentPath: string,
  url: string,
  ip: string,
  userAgent: string,
  createdAt: string,
}

function generateLink(event: DenormalizedEvent): Link | null {
  switch (event.type) {
    case EventType.LaunchRoadmapLinkOpen:
      return null //TODO: have actual link
    case EventType.NextStepCreate:
      return null
    case EventType.NextStepUpdate:
      return null
    case EventType.NextStepDelete:
      return null
    case EventType.DocumentApprove:
      return null
    case EventType.DocumentOpen:
      return { body: event.documentTitle, href: getBackendFilePath(event.documentPath) }
    case EventType.DocumentUpload:
      return { body: event.documentTitle, href: getBackendFilePath(event.documentPath) }
    case EventType.ProposalApprove:
      return null
    case EventType.ProposalDecline:
      return null
    case EventType.ProposalOpen:
      return null
    case EventType.CreateInternalMessage:
      return null
    case EventType.ProductInfoLinkOpen:
      return null //TODO: have actual link
    case EventType.InviteStakeholder:
      return null
  }
}
