// app/core/utils.ts
import { Ctx } from "blitz"
import { Prisma, SiteRole } from "db"

export default function assert(condition: any, message: string): asserts condition {
  if (!condition) throw new Error(message)
}

export const setDefaultVendorId = <T extends Record<any, any>>(
  input: T,
  { session }: Ctx
): T & { vendorId: Prisma.IntNullableFilter | number } => {
  console.log("In setDefaultVendorId.............")
  assert(session.vendorId, "Missing session.vendorId in setDefaultVendorId")
  if (input.vendorId) {
    // Pass through the input
    return input as T & { vendorId: number }
  } else if (session.roles?.includes(SiteRole.SiteAdmin)) {
    // Allow viewing any vendor
    return { ...input, vendorId: { not: 0 } }
  } else {
    // Set vendorId to session.vendorId
    return { ...input, vendorId: session.vendorId }
  }
}

export const enforceSiteAdminIfNotCurrentVendor = <T extends Record<any, any>>(input: T, ctx: Ctx): T => {
  console.log("In enforceSiteAdminIfNotCurrentVendor.............")
  assert(ctx.session.vendorId, "missing session.vendorId")
  assert(input.vendorId, "missing input.vendorId")

  if (input.vendorId !== ctx.session.vendorId) {
    ctx.session.$authorize(SiteRole.SiteAdmin)
  }
  return input
}
