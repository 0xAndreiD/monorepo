import { AuthenticationError, AuthorizationError, Ctx, resolver } from "blitz"
import db, { EventType, LinkType, Prisma } from "db"
import { groupBy } from "lodash"
import { getExternalUploadPath } from "../../core/util/upload"
import { generateLinkFromEventType } from "../../portal-details/queries/getPortalDetail"

export type DenormalizedEvent = {
  stakeholderName: string
  customerName: string
  type: EventType
  linkId: number
  linkType: LinkType
  linkBody: string
  linkHref: string
  url: string
  ip: string
  userAgent: string
  createdAt: string
}
// L.id                                 AS "linkId",
//   L.body                               AS "linkBody",
//   L.href                               AS "linkHref",
export async function getStakeholderActivityLogRaw(portalIds: number[]) {
  return await db.$queryRaw<DenormalizedEvent[]>`
    WITH base_events AS (
      SELECT U."firstName" || ' ' || U."lastName" AS "stakeholderName",
             P."customerName",
             E.type,
             E."linkId",
             L.type                               AS "linkType",
             L.body                               AS "linkBody",
             L.href                               AS "linkHref",
             E.url,
             E.ip,
             E."userAgent",
             E."createdAt"
      FROM "Event" E
             JOIN "UserPortal" UP
                  ON E."userId" = UP."userId" AND
                     E."portalId" = UP."portalId" AND
                     UP.role = 'Stakeholder'
             JOIN "User" U ON U.id = E."userId"
             JOIN "Portal" P ON E."portalId" = P.id
             LEFT JOIN "Link" L ON E."linkId" = L.id

      WHERE E."portalId" IN (${Prisma.join(portalIds)})
      ORDER BY E."createdAt" DESC
    )
    SELECT *
    FROM base_events BE
    LIMIT 25
  `
}

export default resolver.pipe(resolver.authorize(), async (input: {}, ctx: Ctx) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  // ctx.session.$authorize(Role.AccountExecutive)
  const userId = ctx.session.userId
  if (!userId) throw new AuthenticationError("no userId provided")

  const user = await db.user.findUnique({
    where: { id: userId },
    include: { accountExecutive: { include: { vendorTeam: { include: { vendor: true } } } } },
  })
  if (!user || !user.accountExecutive) throw new AuthorizationError("Not an account executive")

  const header = {
    vendorLogo: user.accountExecutive.vendorTeam.vendor.logoUrl,
  }

  const portalIds = (
    await db.$queryRaw<Array<{ portalId: number }>>`
      SELECT "portalId"
      FROM "UserPortal"
      WHERE ("isPrimaryContact" IS TRUE OR "isSecondaryContact" IS TRUE)
        AND "userId" = ${userId}
    `
  ).map((x) => x.portalId)

  const opportunityEngagement = await db.$queryRaw<
    Array<{
      portalId: number
      customerName: string
      eventCount: number
    }>
  >`
    SELECT E."portalId",
           (SELECT "customerName" FROM "Portal" WHERE id = E."portalId"),
           COUNT(*) AS "eventCount"
    FROM "Event" E
           JOIN "UserPortal" UP ON UP."userId" = E."userId" AND UP."portalId" = E."portalId"
    WHERE E."portalId" IN (${Prisma.join(portalIds)})
      AND UP.role = 'Stakeholder'
    GROUP BY E."portalId"
    ORDER BY "eventCount" DESC;
  `

  const stakeholderActivityLogRaw = await getStakeholderActivityLogRaw(portalIds)
  const stakeholderActivityLog = stakeholderActivityLogRaw.map((x) => ({
    stakeholderName: x.stakeholderName,
    customerName: x.customerName,
    type: x.type,
    link: generateLinkFromEventType(x),
    timestamp: new Date(x.createdAt).toISOString(),
  }))

  const activePortals = await db.$queryRaw<
    Array<{
      portalId: number
      customerName: string
      currentRoadmapStage: number
      customerNumberOfStages: number
      hasPrimaryContact: boolean
      primaryContactFirstName: string
      primaryContactLastName: string
      primaryContactJobTitle: string
      primaryContactEmail: string
    }>
  >`WITH "hasStakeholder" AS (SELECT P.id                               AS "portalId",
                                       P."customerName"                   AS "customerName",
                                       P."currentRoadmapStage"            AS "currentRoadmapStage",
                                       (SELECT COUNT(*)
                                        FROM "RoadmapStage"
                                        WHERE "portalId" = UP."portalId") AS "customerNumberOfStages",
                                       S."userId" IS NOT NULL             AS "hasPrimaryContact",
                                       U."firstName"                      AS "primaryContactFirstName",
                                       U."lastName"                       AS "primaryContactLastName",
                                       S."jobTitle"                       AS "primaryContactJobTitle",
                                       U.email                            AS "primaryContactEmail"
                                FROM "UserPortal" UP
                                       INNER JOIN "Portal" P ON UP."portalId" = P.id
                                       INNER JOIN "User" U ON UP."userId" = U.id
                                       JOIN "Stakeholder" S ON U.id = S."userId"
                                WHERE UP."isPrimaryContact" = TRUE
                                  AND UP.role = 'Stakeholder'
                                  AND UP."portalId" IN (${Prisma.join(portalIds)})),
           "noStakeholder" AS (SELECT P.id                               AS "portalId",
                                      P."customerName"                   AS "customerName",
                                      P."currentRoadmapStage"            AS "currentRoadmapStage",
                                      (SELECT COUNT(*)
                                       FROM "RoadmapStage"
                                       WHERE "portalId" = UP."portalId") AS "customerNumberOfStages",
                                      S."userId" IS NOT NULL             AS "hasPrimaryContact",
                                      U."firstName"                      AS "primaryContactFirstName",
                                      U."lastName"                       AS "primaryContactLastName",
                                      S."jobTitle"                       AS "primaryContactJobTitle",
                                      U.email                            AS "primaryContactEmail"
                               FROM "UserPortal" UP
                                      INNER JOIN "Portal" P ON UP."portalId" = P.id
                                      INNER JOIN "User" U ON UP."userId" = U.id
                                      LEFT JOIN "Stakeholder" S ON U.id = S."userId"
                               WHERE UP."portalId" IN (${Prisma.join(portalIds)})
                                 AND UP."portalId" NOT IN (SELECT "portalId" FROM "hasStakeholder")
                                 AND UP."userId" = ${userId}),
           combined AS (
             SELECT *
             FROM "hasStakeholder"
             UNION ALL
             SELECT *
             FROM "noStakeholder")
      SELECT *
      FROM combined
  `

  const activePortalsStakeholders = await db.$queryRaw<
    Array<{
      portalId: number
      firstName: string
      lastName: string
      email: string
      hasStakeholderApproved: boolean | null
      eventCount: number
    }>
  >`
    SELECT E."portalId",
           U."firstName",
           U."lastName",
           U.email,
           "hasStakeholderApproved",
           COUNT(*) AS "eventCount"
    FROM "Event" E
           JOIN "User" U ON U.id = E."userId"
           JOIN "UserPortal" UP ON E."userId" = UP."userId"
      AND E."portalId" = UP."portalId"
      AND UP.role = 'Stakeholder'
    WHERE E."portalId" IN (${Prisma.join(portalIds)})
    GROUP BY E."portalId", E."userId", U."firstName", U."lastName", email, "hasStakeholderApproved"`
  const stakeholderEvents = groupBy(activePortalsStakeholders, "portalId")

  console.log("main", activePortals)
  console.log("join", activePortalsStakeholders)
  const activePortalsDocs = await db.$queryRaw<
    Array<{
      portalId: number
      title: string
      path: string
      eventCount: number
    }>
  >`
    SELECT E."portalId" AS "portalId",
           L.body       AS title,
           L.href       AS path,
           COUNT(*)     AS "eventCount"
    FROM "Event" E
           JOIN "PortalDocument" PD ON PD.id = E."linkId"
           JOIN "Link" L ON PD."linkId" = L.id
           JOIN "UserPortal" UP ON E."userId" = UP."userId"
      AND E."portalId" = UP."portalId"
      AND UP.role = 'Stakeholder'
    WHERE E."portalId" IN (${Prisma.join(portalIds)})
    GROUP BY E."portalId", title, path
  `
  const documentEvents = groupBy(
    activePortalsDocs.map((x) => ({
      portalId: x.portalId,
      body: x.title,
      href: getExternalUploadPath(x.path),
      eventCount: x.eventCount,
    })),
    "portalId"
  )

  const all = activePortals.map((p) => ({
    portalId: p.portalId,
    customerName: p.customerName,
    currentRoadmapStage: p.currentRoadmapStage,
    customerNumberOfStages: p.customerNumberOfStages,
    primaryContact: p.hasPrimaryContact
      ? {
          firstName: p.primaryContactFirstName,
          lastName: p.primaryContactLastName,
          jobTitle: p.primaryContactJobTitle,
          email: p.primaryContactEmail,
        }
      : null,
    stakeholderEvents: stakeholderEvents[p.portalId] ?? [],
    documentEvents: documentEvents[p.portalId] ?? [],
  }))
  console.log("final", all)

  return {
    header,
    opportunityEngagement,
    stakeholderActivityLog,
    activePortals: all,
  }
})
