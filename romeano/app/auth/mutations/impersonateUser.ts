import getCurrentUser from "app/users/queries/getCurrentUser"
import { resolver, Ctx, AuthorizationError } from "blitz"
import db, { Role, SiteRole } from "db"
import * as z from "zod"

export const ImpersonateUserInput = z.object({
  userEmail: z.string(),
})

export default resolver.pipe(
  resolver.zod(ImpersonateUserInput),

  // Ensure logged in user is SiteAdmin
  resolver.authorize(SiteRole.SiteAdmin),

  async ({ userEmail }, ctx) => {
    const currentUser = await getCurrentUser({}, ctx)
    if (currentUser!.email!.endsWith("@romeano.com") && currentUser.roles?.includes(SiteRole.SiteAdmin)) {
      throw new AuthorizationError("Not authorized to impersonate")
    }

    const user = await db.user.findFirst({
      where: {
        email: userEmail,
      },
      include: {
        accountExecutive: true,
        stakeholder: true,
      },
    })
    if (!user) throw new Error("Could not find user " + userEmail)

    console.log("Switching user...", user, ctx.session.userId)
    let roles: Array<SiteRole | Role> = [user.role]
    if (user.accountExecutive) {
      roles.push(Role.AccountExecutive)
    }
    if (user.stakeholder) {
      roles.push(Role.Stakeholder)
    }
    await ctx.session.$create({
      userId: user.id,
      roles: roles,
      vendorId: user.vendorId,
      impersonatingFromUserId: ctx.session.userId,
    })

    return user
  }
)
