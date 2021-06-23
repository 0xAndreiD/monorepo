import { NotFoundError, resolver } from "blitz"
import db from "db"
import { groupBy } from "lodash"
import { z } from "zod"
import { getBackendFilePath } from "../../core/util/upload"

const GetVendorStats = z.object({
  // This accepts type of undefined, but is required at runtime
  id: z.number().optional().refine(Boolean, "Required")
})

export default resolver.pipe(resolver.zod(GetVendorStats), async ({ id }) => {
  // export default resolver.pipe(resolver.zod(GetPortalDetail), resolver.authorize(), async ({ id }) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant

  const user = await db.user.findUnique({
    where: { id },
    include: {
      userPortals: {
        include: {
          portal: {
            include: {
              _count: {
                select: {
                  events: true
                }
              },
              roadmapStages: {
                include: {
                  tasks: true //get the associated tasks for a stage
                }
              },
              nextStepsTasks: { orderBy: { id: "asc" } },
              vendor: true,
              documents: { orderBy: { id: "asc" } },
              images: { orderBy: { id: "asc" } },
              productInfoSections: {
                include: {
                  links: true
                }
              },
              userPortals: {
                include: {
                  user: {
                    include: {
                      accountExecutive: true,
                      stakeholder: true
                    }
                  }
                }
              },
              internalNotes: true
            }
          }
        }
      }
    }
  })

  if (!user) throw new NotFoundError()

  const opportunityEngagement = await db.$queryRaw<Array<{
    portalId: number,
    customerName: string,
    eventCount: number
  }>>`
SELECT "portalId",
       (SELECT "customerName" FROM "Portal" WHERE id = "portalId"),
       count(*) AS "eventCount"
FROM "Event"
WHERE "portalId" IN (SELECT "portalId"
                     FROM "UserPortal"
                     WHERE "isPrimaryContact" IS TRUE
                       AND "userId" = ${id})
GROUP BY "portalId"
ORDER BY "eventCount" DESC;
`

  const stakeholderActivityRaw = await db.$queryRaw<Array<{
    stakeholderName: string,
    customerName: string,
    documentTitle: string,
    documentPath: string,
    timestamp: string,
  }>>`
SELECT "User"."firstName" || ' ' || "User"."lastName" AS "stakeholderName",
       "Portal"."customerName",
       "Document".title                               AS "documentTitle",
       "Document".path                                AS "documentPath",
       "Event"."createdAt"                            AS timestamp
FROM "Event"
         INNER JOIN "Portal" ON "Event"."portalId" = "Portal".id
         INNER JOIN "User" ON "Event"."userId" = "User".id
         INNER JOIN "Document" ON "Event"."documentId" = "Document".id
WHERE "Event"."portalId" IN (SELECT "UserPortal"."portalId" FROM "UserPortal" WHERE "UserPortal"."userId" = ${id})
ORDER BY timestamp DESC
`
  const stakeholderActivity = stakeholderActivityRaw.map(x => ({
    stakeholderName: x.stakeholderName,
    customerName: x.customerName,
    link: { //link should always exist due to joining on documentId
      body: x.documentTitle,
      href: getBackendFilePath(x.documentPath)
    },
    timestamp: x.timestamp
  }))

  const activePortals1 = await db.$queryRaw<Array<{
    portalId: number,
    customerName: string,
    currentRoadmapStage: number,
    customerNumberOfStages: number,
    primaryContactName: string,
    primaryContactJobTitle: string,
    primaryContactEmail: string,
    primaryContactPhotoUrl: string
  }>>`
SELECT "Portal".id                                                                      AS "portalId",
       "Portal"."customerName"                                                          AS "customerName",
       "Portal"."currentRoadmapStage"                                                   AS "currentRoadmapStage",
       (SELECT COUNT(*) FROM "RoadmapStage" WHERE "portalId" = "UserPortal"."portalId") AS "customerNumberOfStages",
       "User"."firstName" || ' ' || "User"."lastName"                                   AS "primaryContactName",
       "AccountExecutive"."jobTitle"                                                    AS "primaryContactJobTitle",
       "User".email                                                                     AS "primaryContactEmail",
       "User"."photoUrl"                                                                AS "primaryContactPhotoUrl"
FROM "UserPortal"
         INNER JOIN "Portal" ON "UserPortal"."portalId" = "Portal".id
         INNER JOIN "User" ON "UserPortal"."userId" = "User".id
         INNER JOIN "AccountExecutive" ON "User".id = "AccountExecutive"."userId"
WHERE "UserPortal"."userId" = ${id}
`
  const activePortalsStakeholders = await db.$queryRaw<Array<{
    portalId: number,
    name: string,
    email: string,
    isApprovedBy: boolean,
    eventCount: number
  }>>`
SELECT "portalId",
       U."firstName" || ' ' || U."lastName" AS name,
       U.email,
       "isApprovedBy",
       COUNT(*)                             AS "eventCount"
FROM "Event"
         JOIN "User" U ON U.id = "Event"."userId"
         JOIN "Stakeholder" S ON U.id = S."userId"
WHERE "portalId" IN (SELECT "portalId"
                     FROM "UserPortal"
                     WHERE ("isPrimaryContact" IS TRUE OR "isSecondaryContact" IS TRUE)
                       AND "userId" = ${id})
GROUP BY "portalId", "Event"."userId", name, email, "isApprovedBy"`
  const grouped2 = groupBy(activePortalsStakeholders, "portalId")

  console.log("main", activePortals1)
  console.log("join", activePortalsStakeholders)
  const activePortalsDocs = await db.$queryRaw<Array<{
    portalId: number,
    title: string,
    path: string,
    eventCount: number
  }>>`
SELECT "Event"."portalId" AS "portalId",
       title,
       path,
       COUNT(*)           AS "eventCount"
FROM "Event"
         JOIN "Document" D ON D.id = "Event"."documentId"
WHERE "Event"."portalId" IN (SELECT "portalId"
                             FROM "UserPortal"
                         WHERE ("isPrimaryContact" IS TRUE OR "isSecondaryContact" IS TRUE)
                           AND "userId" = ${id})
GROUP BY "Event"."portalId", title, path
`
  const grouped3 = groupBy(activePortalsDocs.map(x => ({
    portalId: x.portalId,
    body: x.title,
    href: getBackendFilePath(x.path),
    eventCount: x.eventCount
  })),"portalId")

  const all = activePortals1.map(p => ({
    portalId: p.portalId,
    customerName: p.customerName,
    currentRoadmapStage: p.currentRoadmapStage,
    customerNumberOfStages: p.customerNumberOfStages,
    primaryContact: {
      name: p.primaryContactName,
      jobTitle: p.primaryContactJobTitle,
      email: p.primaryContactEmail,
      photoUrl: p.primaryContactPhotoUrl
    },
    stakeholderEvents: grouped2[p.portalId],
    documentEvents: grouped3[p.portalId],
    portalHref: `/customerPortals/${p.portalId}` //fixme!
  }))
  console.log("final", all)


  // debugger
  const activePortals = [
    {
      customerName: "Koch",
      customerCurrentStage: 2,
      customerNumberOfStages: 4,
      primaryContact: {
        name: "Nick Franklin",
        jobTitle: "Director of Operations",
        email: "nick@mira.com",
        photoUrl: ""
      },
      stakeholderEvents: [
        {
          name: "N F",
          email: "a@a.com",
          isApprovedBy: true,
          eventCount: 22
        },
        {
          name: "K S",
          email: "a@a.com",
          isApprovedBy: true,
          eventCount: 12
        },
        {
          name: "W I",
          email: "a@a.com",
          isApprovedBy: true,
          eventCount: 8
        },
        {
          name: "P S",
          email: "a@a.com",
          isApprovedBy: false,
          eventCount: 2
        }
      ],
      documentEvents: [
        {
          body: "Mira Sales Deck",
          href: "",
          eventCount: 8
        },
        {
          body: "Mira Connect Video",
          href: "",
          eventCount: 6
        },
        {
          body: "Quote Proposal",
          href: "",
          eventCount: 2
        }
      ],
      portalHref: ""
    }
  ]
  return {
    opportunityEngagement,
    stakeholderActivity,
    activePortals: all
  }
})
