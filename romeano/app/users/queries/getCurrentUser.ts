import { Ctx } from "blitz"
import db from "db"

export default async function getCurrentUser(_ = null, { session }: Ctx) {
  if (!session.userId) return null

  const user = await db.user.findFirst({
    include: { accountExecutive: true, stakeholder: true },
    where: { id: session.userId }
  })

  return user
}
