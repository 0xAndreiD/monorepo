// app/core/utils.ts
import { Ctx } from "blitz"
import { AccountExecutive, Prisma, Role, SiteRole, Stakeholder, User } from "db"
import db from "db"
import { DebugLoggerFunction } from "util"

export default function assert(condition: any, message: string): asserts condition {
  if (!condition) throw new Error(message)
}

export const setDefaultVendorId = <T extends Record<any, any>>(
  input: T,
  ctx: Ctx
): T & { vendorId: Prisma.IntNullableFilter | number } => {
  console.log("In setDefaultVendorId.............")
  assert(ctx.session.vendorId, "Missing session.vendorId in setDefaultVendorId")
  if (input.vendorId) {
    // Pass through the input
    return input as T & { vendorId: number }
  } else if (ctx.session.roles?.includes(SiteRole.SiteAdmin)) {
    // Allow viewing any vendor
    return { ...input, vendorId: { not: 0 } }
  } else {
    // Set vendorId to session.vendorId
    return { ...input, vendorId: ctx.session.vendorId }
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

export const enforceCurrentVendor = <T extends Record<any, any>>(input: T, ctx: Ctx): T => {
  // Set input.vendorId to the current vendor ID if one is not set
  // This allows SUPERADMINs to pass in a specific vendorId
  setDefaultVendorId(input, ctx)
  // But now we need to enforce input.vendorId matches
  // session.vendorId unless user is a SUPERADMIN
  return enforceSiteAdminIfNotCurrentVendor(input, ctx)
}

// Temporary helper function to populate all DB records with the correct vendorID from vendor Team
export const updateVendorIdInAllTablesForUser = async (user: User, optimize = false) => {
  const accountExecutive = await db.accountExecutive.findFirst({ where: { userId: user.id } })
  const stakeholder = await db.stakeholder.findFirst({ where: { userId: user.id } })

  if (optimize && user.vendorId && accountExecutive?.vendorId && stakeholder?.vendorId) {
    console.log("User, AE and stakeholder have vendorId, returning without updating tables for user", user.id)
    return Promise.resolve()
  }

  if (accountExecutive) {
    // Find vendorId from vendorTeam
    const vendorTeam = await db.vendorTeam.findUnique({
      where: { id: accountExecutive.vendorTeamId },
    })
    if (!vendorTeam) {
      console.log("User has no vendor team, returning without updating table for user", user.id)
      return Promise.resolve()
    }
    if (!user.vendorId) {
      // Update user
      try {
        await db.user.update({
          where: { id: user.id },
          data: { vendorId: vendorTeam.vendorId },
        })
        console.log("Updated vendorId in user table for user", user.id)
      } catch (err) {
        console.warn("Ignoring error updating user", user.id, err)
      }
    }
    if (!accountExecutive?.vendorId) {
      // Update AE
      try {
        await db.accountExecutive.update({
          where: { id: user.id },
          data: { vendorId: vendorTeam.vendorId },
        })
        console.log("Updated vendorId in AE table for user", user.id)
      } catch (err) {
        console.warn("Ignoring error updating AE for user", user.id, err)
      }
    }
  }

  // Get all user portals for the user
  const userPortals = await db.userPortal.findMany({
    where: { userId: user.id, role: accountExecutive ? Role.AccountExecutive : Role.Stakeholder },
  })
  // Update all related tables
  await Promise.all(
    userPortals?.map(async (userPortal) => {
      // Get all portals
      const portals = await db.portal.findMany({
        where: {
          id: userPortal.portalId,
        },
      })
      // Update all related tables
      await Promise.all(
        portals.map(async (portal) => {
          // Update user portal record
          try {
            await db.userPortal.update({
              where: {
                userId_portalId: {
                  userId: user.id,
                  portalId: userPortal.portalId,
                },
              },
              data: { vendorId: portal.vendorId },
            })
            console.log("Updated vendorId in userPortal table for user", user.id)
          } catch (err) {
            console.warn("Ignoring error updating userPortal for user", user.id, err)
          }

          const updateData1 = {
            where: { userId: user.id, portalId: portal.id },
            data: { vendorId: portal.vendorId },
          }

          try {
            await db.event.updateMany(updateData1)
          } catch (err) {
            console.warn("Ignoring error updating event, internalNote, nextStepsTask for user", user.id, err)
          }
          try {
            await db.internalNote.updateMany(updateData1)
          } catch (err) {
            console.warn("Ignoring error updating event, internalNote, nextStepsTask for user", user.id, err)
          }
          try {
            await db.nextStepsTask.updateMany(updateData1)
          } catch (err) {
            console.warn("Ignoring error updating event, internalNote, nextStepsTask for user", user.id, err)
          }
          console.log("Updated vendorId in event, internalNote, nextStepsTask for user", user.id)

          const updateData2 = {
            where: { portalId: portal.id },
            data: { vendorId: portal.vendorId },
          }
          try {
            await db.portalDocument.updateMany(updateData2)
          } catch (err) {
            console.warn("Ignoring error updating portalDocument for user", user.id, err)
          }
          try {
            await db.portalImage.updateMany(updateData2)
          } catch (err) {
            console.warn("Ignoring error updating portalImage", user.id, err)
          }
          try {
            await db.productInfoSection.updateMany(updateData2)
          } catch (err) {
            console.warn("Ignoring error updating productInfoSection", user.id, err)
          }
          try {
            await db.roadmapStage.updateMany(updateData2)
          } catch (err) {
            console.warn("Ignoring error updating roadmapStage", user.id, err)
          }
          try {
            await db.template.updateMany(updateData2)
          } catch (err) {
            console.warn("Ignoring error updating template for user", user.id, err)
          }
          console.log(
            "Updated vendorId in portalDocument, portalImage, productInfoSection, roadmapStage, template for user",
            user.id
          )
        })
      )
    })
  )
}
