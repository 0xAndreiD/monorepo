import { Ctx } from "blitz"
import db from "db"

export default async function getCurrentUser(_ = null, { session }: Ctx) {
  if (!session.userId) return null

  const user = await db.user.findFirst({
    include: {
      accountExecutive: true,
      stakeholder: true,
      userPortals: true
    },
    where: { id: session.userId }
  })


  return { ...user, userPortals: user?.userPortals.map((x) => x.portalId) }
}
