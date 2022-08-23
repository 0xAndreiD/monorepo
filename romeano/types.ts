import { DefaultCtx, SessionContext, SimpleRolesIsAuthorized } from "blitz"
import { LinkType, Role, SiteRole, User, Vendor } from "db"
import { IncomingHttpHeaders } from "http"

type CustomIsAuthorizedArgs = {
  ctx: any
  args: [roleOrRoles?: Role | SiteRole | Array<Role | SiteRole>]
}
export function customIsAuthorized({ ctx, args }: CustomIsAuthorizedArgs) {
  // can access ctx.session, ctx.session.userId, etc
  console.log("CustomIsAuthorized...", ctx.session.userId, ctx.session.roles, ctx.session.vendorId, args)
  if (!ctx.session.userId) {
    console.error("Missing userId in session")
    return false
  }
  if (!ctx.session.vendorId) {
    console.error("Missing vendorId in session")
    // Temporarily allow this until we fix the vendorId data in all prod DB tables
    // return false
  }
  // TODO: Authorize current user has access to the requested resources for this vendor ID
  const [roleOrRoles, options = {}] = args

  // No roles required, so all roles allowed
  if (!roleOrRoles) return true

  const rolesToAuthorize: Array<Role | SiteRole> = []
  if (Array.isArray(roleOrRoles)) {
    rolesToAuthorize.push(...roleOrRoles)
  } else if (roleOrRoles) {
    rolesToAuthorize.push(roleOrRoles)
  }
  const sessionRoles = (ctx.session as SessionContext).$publicData.roles || []
  console.log("sessionRoles", sessionRoles, ctx.session.roles)
  for (const role of rolesToAuthorize) {
    if (sessionRoles!.includes(role)) return true
  }
  return false
}

declare module "blitz" {
  export interface Ctx extends DefaultCtx {
    session: SessionContext
    ip: string | undefined
    headers: IncomingHttpHeaders
  }

  export interface Session {
    isAuthorized: typeof customIsAuthorized
    PublicData: {
      userId: User["id"]
      roles: Array<Role | SiteRole>
      vendorId?: Vendor["id"]
    }
  }
}

export enum Device {
  Unknown,
  Computer,
  Mobile,
}

export type EventCounted<T> = T & { eventCount: number }
export type Contact = {
  firstName: string
  lastName: string
  jobTitle?: string
  email: string
}
export type Stakeholder = Contact & {
  hasStakeholderApproved: boolean | null
}
export type VendorContact = Contact & { photoUrl: string }
export type Link = {
  body: string
  href: string
}

export type LinkWithId = Link & { id: number }
export type LinkWithType = LinkWithId & { type: LinkType }
