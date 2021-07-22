import { AuthenticationError, AuthorizationError, Ctx, resolver } from "blitz"
import db, { EventType, Prisma } from "db"
import { groupBy } from "lodash"
import { getBackendFilePath } from "../../core/util/upload"
import { generateLinkFromEventType } from "../../portal-details/queries/getPortalDetail"

export default resolver.pipe(
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

    const stakeholderActivityLogRaw = await db.$queryRaw<Array<{
      stakeholderName: string,
      customerName: string,
      type: EventType,
      documentTitle: string,
      documentPath: string,
      createdAt: string,
    }>>`
      SELECT U."firstName" || ' ' || U."lastName" AS "stakeholderName",
             P."customerName",
             E.type,
             D.title                              AS "documentTitle",
             D.path                               AS "documentPath",
             E."createdAt"
      FROM "Event" E
             JOIN "UserPortal" UP
                  ON E."userId" = UP."userId" AND E."portalId" = UP."portalId" AND UP.role = 'Stakeholder'
             JOIN "User" U on U.id = E."userId"
             JOIN "Portal" P on E."portalId" = P.id
             LEFT JOIN "Document" D ON E."documentId" = D.id
      ORDER BY E."createdAt" DESC
      LIMIT 25
    `
    const stakeholderActivityLog = stakeholderActivityLogRaw.map(x => ({
      stakeholderName: x.stakeholderName,
      customerName: x.customerName,
      type: x.type,
      link: generateLinkFromEventType(x),
      timestamp: new Date(x.createdAt).toISOString()
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
      SELECT P.id                               AS "portalId",
             P."customerName"                   AS "customerName",
             P."currentRoadmapStage"            AS "currentRoadmapStage",
             (SELECT COUNT(*)
              FROM "RoadmapStage"
              WHERE "portalId" = UP."portalId") AS "customerNumberOfStages",
             "User"."firstName"                 AS "primaryContactFirstName",
             "User"."lastName"                  AS "primaryContactLastName",
             "Stakeholder"."jobTitle"           AS "primaryContactJobTitle",
             "User".email                       AS "primaryContactEmail",
             "User"."photoUrl"                  AS "primaryContactPhotoUrl"
      FROM "UserPortal" UP
             INNER JOIN "Portal" P ON UP."portalId" = P.id
             INNER JOIN "User" ON UP."userId" = "User".id
             INNER JOIN "Stakeholder" ON "User".id = "Stakeholder"."userId"
      WHERE UP."isPrimaryContact" = TRUE
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
             JOIN "UserPortal" UP
                  ON E."userId" = UP."userId" AND E."portalId" = UP."portalId" AND UP.role = 'Stakeholder'
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
      SELECT E."portalId" AS "portalId",
             title,
             path,
             COUNT(*)     AS "eventCount"
      FROM "Event" E
             JOIN "Document" D ON D.id = E."documentId"
             JOIN "UserPortal" UP
                  ON E."userId" = UP."userId" AND E."portalId" = UP."portalId" AND UP.role = 'Stakeholder'
      WHERE E."portalId" IN (${Prisma.join(portalIds)})
      GROUP BY E."portalId", title, path
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
      stakeholderActivity: stakeholderActivityLog,
      activePortals: all
    }
  })
