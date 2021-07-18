import { AuthenticationError, AuthorizationError, Ctx, resolver } from "blitz"
import db, { Prisma } from "db"
import { groupBy } from "lodash"
import { z } from "zod"
import { getBackendFilePath } from "../../core/util/upload"

const GetVendorStats = z.object({
  // This accepts type of undefined, but is required at runtime
  // userId: z.number().optional().refine(Boolean, "Required")
})

export default resolver.pipe(
  resolver.zod(GetVendorStats),
  resolver.authorize(),
  async (input: {}, ctx: Ctx) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    // ctx.session.$authorize(Role.AccountExecutive)
    const userId = ctx.session.userId
    if (!userId) throw new AuthenticationError("no userId provided")

    const user = await db.user.findUnique({
      where: { id: userId },
      include: { accountExecutive: true }
    })
    if (!user || !user.accountExecutive) throw new AuthorizationError("Not an account executive")

    const portalIds = (await db.$queryRaw<Array<{ portalId: number }>>`
      SELECT "portalId"
      FROM "UserPortal"
      WHERE ("isPrimaryContact" IS TRUE OR "isSecondaryContact" IS TRUE)
        AND "userId" = ${userId}
    `).map(x => x.portalId)

    const opportunityEngagement = await db.$queryRaw<Array<{
      portalId: number,
      customerName: string,
      eventCount: number
    }>>`
      SELECT "portalId",
             (SELECT "customerName" FROM "Portal" WHERE id = "portalId"),
             count(*) AS "eventCount"
      FROM "Event"
      WHERE "portalId" IN (${Prisma.join(portalIds)})
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
             INNER JOIN "Portal"
                        ON "Event"."portalId" = "Portal".id
             INNER JOIN "User" ON "Event"."userId" = "User".id
             INNER JOIN "Document" ON "Event"."documentId" = "Document".id
      WHERE "Event"."portalId" IN (${Prisma.join(portalIds)})
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

    const activePortals = await db.$queryRaw<Array<{
      portalId: number,
      customerName: string,
      currentRoadmapStage: number,
      customerNumberOfStages: number,
      primaryContactFirstName: string,
      primaryContactLastName: string,
      primaryContactJobTitle: string,
      primaryContactEmail: string,
      primaryContactPhotoUrl: string
    }>>`
      SELECT "Portal".id                                  AS "portalId",
             "Portal"."customerName"                      AS "customerName",
             "Portal"."currentRoadmapStage"               AS "currentRoadmapStage",
             (SELECT COUNT(*)
              FROM "RoadmapStage"
              WHERE "portalId" = "UserPortal"."portalId") AS "customerNumberOfStages",
             "User"."firstName"                           AS "primaryContactFirstName",
             "User"."lastName"                            AS "primaryContactLastName",
             "AccountExecutive"."jobTitle"                AS "primaryContactJobTitle",
             "User".email                                 AS "primaryContactEmail",
             "User"."photoUrl"                            AS "primaryContactPhotoUrl"
      FROM "UserPortal"
             INNER JOIN "Portal" ON "UserPortal"."portalId" = "Portal".id
             INNER JOIN "User" ON "UserPortal"."userId" = "User".id
             INNER JOIN "AccountExecutive" ON "User".id = "AccountExecutive"."userId"
      WHERE "UserPortal"."isPrimaryContact" = TRUE
        AND "portalId" IN (${Prisma.join(portalIds)})
    `
    const activePortalsStakeholders = await db.$queryRaw<Array<{
      portalId: number,
      firstName: string,
      lastName: string,
      email: string,
      hasStakeholderApproved: boolean | null,
      eventCount: number
    }>>`
      SELECT E."portalId",
             U."firstName",
             U."lastName",
             U.email,
             "hasStakeholderApproved",
             COUNT(*) AS "eventCount"
      FROM "Event" E
             JOIN "User" U ON U.id = E."userId"
             JOIN "UserPortal" UP ON U.id = UP."userId" AND E."portalId" = UP."portalId"
      WHERE E."portalId" IN (${Prisma.join(portalIds)})
      GROUP BY E."portalId", E."userId", U."firstName", U."lastName", email, "hasStakeholderApproved"`
    const stakeholderEvents = groupBy(activePortalsStakeholders, "portalId")

    console.log("main", activePortals)
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
      WHERE "Event"."portalId" IN (${Prisma.join(portalIds)})
      GROUP BY "Event"."portalId", title, path
    `
    const documentEvents = groupBy(activePortalsDocs.map(x => ({
      portalId: x.portalId,
      body: x.title,
      href: getBackendFilePath(x.path),
      eventCount: x.eventCount
    })), "portalId")

    const all = activePortals.map(p => ({
      portalId: p.portalId,
      customerName: p.customerName,
      currentRoadmapStage: p.currentRoadmapStage,
      customerNumberOfStages: p.customerNumberOfStages,
      primaryContact: {
        firstName: p.primaryContactFirstName,
        lastName: p.primaryContactLastName,
        jobTitle: p.primaryContactJobTitle,
        email: p.primaryContactEmail,
        photoUrl: p.primaryContactPhotoUrl
      },
      stakeholderEvents: stakeholderEvents[p.portalId] ?? [],
      documentEvents: documentEvents[p.portalId] ?? []
    }))
    console.log("final", all)

    return {
      opportunityEngagement,
      stakeholderActivity,
      activePortals: all
    }
  })
