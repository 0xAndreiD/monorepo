import { resolver, Ctx } from "blitz"
import db from "db"

export default resolver.pipe(resolver.authorize(), async (_, ctx) => {
  const userId = ctx.session.$publicData.impersonatingFromUserId
  if (!userId) {
    console.log("Already not impersonating anyone")
    return
  }

  const user = await db.user.findUnique({
    where: { id: userId },
    include: {
      accountExecutive: true,
    },
  })
  if (!user) throw new Error("Could not find user id " + userId)

  await ctx.session.$create({
    userId: user.id,
    roles: [user.role],
    vendorId: user.accountExecutive!.vendorId,
    impersonatingFromUserId: undefined,
  })

  return user
})
