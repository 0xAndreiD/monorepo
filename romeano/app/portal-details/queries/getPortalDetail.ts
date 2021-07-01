import { NotFoundError, resolver } from "blitz"
import db, { Role } from "db"
import { z } from "zod"
import { Device } from "../../../types"
import { getBackendFilePath } from "../../core/util/upload"
import { Reader } from "@maxmind/geoip2-node"
import { readFileSync } from "fs"
import { getOrElse, tryCatch } from "fp-ts/Option"
import { pipe } from "fp-ts/function"
import UAParser from "ua-parser-js"

const reader = Reader.openBuffer(readFileSync("db/geoip/GeoLite2-City.mmdb"))
const GetPortalDetail = z.object({
  // This accepts type of undefined, but is required at runtime
  portalId: z.number().optional().refine(Boolean, "Required")
})

export default resolver.pipe(resolver.zod(GetPortalDetail), async ({ portalId }) => {
// export default resolver.pipe(resolver.zod(GetPortalDetail), resolver.authorize(), async ({ id }) => {
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
          name: `${userPortal.user.firstName} ${userPortal.user.lastName}`,
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

  const stakeholderActivityLogRaw = await db.$queryRaw<Array<{
    stakeholderName: string,
    customerName: string,
    documentTitle: string,
    documentPath: string,
    url: string,
    ip: string,
    userAgent: string,
    createdAt: string,
  }>>`
    SELECT (SELECT "firstName" || ' ' || "lastName" FROM "User" WHERE id = "Event"."userId") AS "stakeholderName",
           "customerName",
           title                                                                             AS "documentTitle",
           path                                                                              AS "documentPath",
           url,
           ip,
           "userAgent",
           "Event"."createdAt"
    FROM "Event"
           JOIN "Portal" P on "Event"."portalId" = P.id
           LEFT JOIN "Document" D ON "Event"."documentId" = D.id
    WHERE "Event"."portalId" = ${portalId}
    ORDER BY "Event"."createdAt" DESC
    LIMIT 25
  `
  const stakeholderActivityLog = stakeholderActivityLogRaw.map(x => {
    const location = pipe(tryCatch(() => {
      const location = reader.city(x.ip)
      return location.city?.names.en && location.country?.names.en ?
        `${location.city?.names.en}, ${location.country?.names.en}` :
        location.country?.names.en ?? "Unknown"
    }), getOrElse(() => "Unknown"))

    return {
      stakeholderName: x.stakeholderName,
      customerName: x.customerName,
      link: x.documentTitle && x.documentPath ?
        { body: x.documentTitle, href: getBackendFilePath(x.documentPath) } :
        { body: "a link", href: x.url },
      location,
      device: UAParser(x.userAgent).device.type === "mobile" ? Device.Mobile : Device.Computer,
      timestamp: new Date(x.createdAt).toISOString()
    }
  })

  return {
    opportunityOverview,
    contacts,
    overallEngagement,
    documents,
    stakeholderEngagement,
    stakeholderActivityLog
  }
})
