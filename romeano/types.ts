import { DefaultCtx, SessionContext, SimpleRolesIsAuthorized } from "blitz"
import { Role, User } from "db"

declare module "blitz" {
  export interface Ctx extends DefaultCtx {
    session: SessionContext
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
  Computer,
  Mobile
}
export type EventCounted<T> = T & { eventCount: number }
export type Contact = {
  name: string,
  jobTitle?: string,
  email: string,
};
export type Stakeholder = Contact & {
  isApprovedBy: boolean,
}
export type VendorContact = Contact & { photoUrl: string }
export type Link = {
  body: string,
  href: string,
}
