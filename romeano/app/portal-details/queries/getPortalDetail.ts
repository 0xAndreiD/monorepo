import { NotFoundError, resolver } from "blitz"
import db, { Role } from "db"
import { z } from "zod"
import { addDays } from "date-fns"
import { Device } from "../../../types"
import { getBackendFilePath } from "../../core/util/upload"

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

  const startDate = new Date(2021, 9, 28)
  const overallEngagement = [
    {
      x: addDays(startDate, 0),
      y: 40
    },
    {
      x: addDays(startDate, 2),
      y: 17
    },
    {
      x: addDays(startDate, 4),
      y: 23
    },
    {
      x: addDays(startDate, 6),
      y: 8
    },
    {
      x: addDays(startDate, 8),
      y: 35
    },
    {
      x: addDays(startDate, 10),
      y: 25
    },
    {
      x: addDays(startDate, 12),
      y: 28
    }
  ]
  const now = new Date()

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
    userAgent: number,
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
  `
  const stakeholderActivityLog = stakeholderActivityLogRaw.map(x => ({
    stakeholderName: x.stakeholderName,
    customerName: x.customerName,
    link: x.documentTitle && x.documentPath ?
      { body: x.documentTitle, href: getBackendFilePath(x.documentPath) } :
      { body: "a link", href: x.url },
    location: x.ip,
    device: Device.Mobile,//use userAgent;
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
