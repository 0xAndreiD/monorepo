import { AuthenticationError, resolver } from "blitz"
import db from "db"
import { z } from "zod"

import { decodeHashId } from "../../core/util/crypto"

export const DeleteStakeholder = z.object({
  portalId: z.string(),
  email: z.string().email().nonempty(),
})

export default resolver.pipe(
  resolver.zod(DeleteStakeholder),
  resolver.authorize(),
  async ({ portalId, email }, ctx) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const currentUserId = ctx.session.userId
    if (!currentUserId) throw new AuthenticationError("no userId provided")

    const portal = await db.portal.findUnique({
      where: { id: decodeHashId(portalId) },
      include: {
        vendor: true,
      },
    })
    if (!portal) throw new AuthenticationError("Could not find portal!")

    const user = await db.user.findFirst({
      where: {
        email: email,
        vendorId: portal.vendorId,
      },
    })
    if (!user) throw new AuthenticationError("Could not find stakeholder user!")

    const userPortal = await db.userPortal.findUnique({
      where: {
        userId_portalId: { userId: user.id, portalId: decodeHashId(portalId) },
      },
      include: {
        user: true,
      },
    })
    if (!userPortal) throw new AuthenticationError("Could not find user in portal!")

    const stakeholder = await db.stakeholder.findUnique({ where: { userId: user.id } })
    if (!stakeholder) throw new AuthenticationError("Could not find stakeholder!")

    try {
      // Delete user portal
      await db.userPortal.delete({
        where: { userId_portalId: { userId: user.id, portalId: decodeHashId(portalId) } },
      })

      // Delete stakeholder
      await db.stakeholder.delete({
        where: { userId: user.id },
      })

      // Delete user
      await db.user.delete({
        where: { id: user.id },
      })
    } catch (err) {
      console.log("Error while deleting userportal/stakeholder/user", err)
    }

    return
  }
)
