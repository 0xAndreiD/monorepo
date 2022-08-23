import { AuthenticationError, AuthorizationError, Ctx, resolver } from "blitz"
import db, { Template, Role } from "db"

import { enforceCurrentVendor } from "app/core/utils"

export default resolver.pipe(
  // Ensure user is logged in
  resolver.authorize(Role.AccountExecutive),

  async (input: {}, ctx: Ctx) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    // ctx.session.$authorize(Role.AccountExecutive)
    const userId = ctx.session.userId
    const vendorId = ctx.session.vendorId
    // if (!userId) throw new AuthenticationError("no userId provided")

    // const user = await db.user.findUnique({
    //   where: { id: userId },
    //   include: { accountExecutive: { include: { vendorTeam: { include: { vendor: true } } } } },
    // })
    // if (!user || !user.accountExecutive) throw new AuthorizationError("Not an account executive")
    // console.log("USER", user)

    const vendorTemplates = await db.template.findMany({
      where: {
        vendorId: vendorId,
      },
    })
    // let vendorTemplates = await Promise.all(
    //   allTemplates.map(async (template) => {
    //     const portal = await db.portal.findUnique({
    //       where: { id: template.portalId },
    //     })
    //     if (!portal) {
    //       console.warn("No portal found for template id and portal id", template.id, template.portalId)
    //     }
    //     if (portal?.vendorId === user?.accountExecutive?.vendorTeam.vendorId) {
    //       return template
    //     }
    //   })
    // )
    // console.log("TEMPLATES", allTemplates, vendorTemplates)

    // return {
    //   templates: <Template[]>vendorTemplates.filter((x) => {
    //     return x !== undefined
    //   }),
    // }
    return {
      templates: vendorTemplates,
    }
  }
)
