import { DefaultCtx, SessionContext, SimpleRolesIsAuthorized } from "blitz"
import { Role, User } from "db"
import { IncomingHttpHeaders } from "http"

declare module "blitz" {
  export interface Ctx extends DefaultCtx {
    session: SessionContext
    ip: string | undefined
    headers: IncomingHttpHeaders
  }

  export interface Session {
    isAuthorized: SimpleRolesIsAuthorized<Role>
    PublicData: {
      userId: User["id"]
      role: Role
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

export enum UploadType {
  Document,
  ProductInfo,
  Proposal,
}
