import { AuthorizationError, Ctx, NotFoundError, resolver } from "blitz"
import db, { EventType, Link, LinkType, PortalDocument, Role, UserPortal } from "db"
import { z } from "zod"
import { Device, Link as FELink } from "../../../types"
import { formatLink, getExternalUploadPath } from "../../core/util/upload"
import UAParser from "ua-parser-js"
import { getLocation } from "../../core/util/location"
import { StakeholderActivityEvent } from "app/core/components/portalDetails/StakeholderActivityLogCard"
import { getStakeholderActivityLogRaw } from "../../vendor-stats/queries/getVendorStats"

import { decodeHashId } from "../../core/util/crypto"

import { enforceSiteAdminIfNotCurrentVendor, setDefaultVendorId } from "app/core/utils"
import { linkSync } from "fs"

const GetPortalDetail = z.object({
  // This accepts type of undefined, but is required at runtime
  portalId: z.string().refine(Boolean, "Required"),
})

// TODO: FIXME: CLEAN THIS UP. DOCUMENTS ARE BEING CONVERTED TO LINKS
// PORTALDOCUMENTS TABLE SEEMS TO BE USELESS - EVERYTHING IS TREATED AS A LINK ANYWAY
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
      documentId: x.id,
      id: x.link.id,
      body: x.link.body,
      href: x.link.type === LinkType.Document ? getExternalUploadPath(x.link.href) : x.link.href,
      isCompleted: role === Role.Stakeholder, //FIXME: should make this actually check
    }))
}

export default resolver.pipe(
  resolver.zod(GetPortalDetail),
  // Ensure user is logged in
  resolver.authorize(),
  // Set input.vendorId to the current vendor ID if one is not set
  // This allows SUPERADMINs to pass in a specific vendorId
  setDefaultVendorId,

  // But now we need to enforce input.vendorId matches
  // session.vendorId unless user is a SUPERADMIN
  enforceSiteAdminIfNotCurrentVendor,

  async (input: { portalId: string }, ctx: Ctx) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const userId = ctx.session.userId
    const vendorId = ctx.session.vendorId
    if (!input.portalId) throw new NotFoundError("Portal ID is needed")

    const portalIdInt = decodeHashId(input.portalId)
    const portal = await db.portal.findFirst({
      where: {
        id: portalIdInt,
        vendorId: vendorId,
      },
      include: {
        roadmapStages: {
          include: { ctaLink: true },
          orderBy: [{ portalId: "asc" }, { createdAt: "asc" }],
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

    if (!portal) throw new NotFoundError()
    if (portal.vendorId !== vendorId) throw new AuthorizationError("Access restricted to this portal")

    const header = {
      vendorLogo: portal.vendor.logoUrl,
      customerName: portal.customerName,
      customerLogo: portal.customerLogoUrl,
    }

    const opportunityOverview = {
      currentRoadmapStage: portal.currentRoadmapStage,
      stages: portal.roadmapStages.map((stage) => ({
        id: stage.id,
        heading: stage.heading,
        date: stage.date?.toISOString(),
        tasks: [],
        ctaLink: stage.ctaLink ?? undefined,
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
      WHERE E."vendorId" = ${vendorId} 
        AND E."portalId" = ${portalIdInt}
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
    WHERE E."vendorId" = ${vendorId} 
      AND E."portalId" = ${portalIdInt}
    GROUP BY E."userId"
    ORDER BY "eventCount" DESC;
  `

    const stakeholderActivityLogRaw = await getStakeholderActivityLogRaw([portalIdInt])
    const stakeholderActivityLog: StakeholderActivityEvent[] = stakeholderActivityLogRaw.map((x) => ({
      stakeholderName: x.stakeholderName,
      customerName: x.customerName,
      type: x.type,
      link: generateLinkFromEventType(x),
      url: x.url,
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
  }
)

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
      return { body: event.linkBody, href: formatLink({ type: event.linkType, href: event.linkHref }) }
    case EventType.InviteStakeholder:
      return null
    case EventType.StakeholderLogin:
      return null
    case EventType.StakeholderPortalOpen:
      return null
  }
}
