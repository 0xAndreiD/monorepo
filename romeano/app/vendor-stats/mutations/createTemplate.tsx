import { AuthenticationError, resolver } from "blitz"
import db, { LinkType, Role } from "db"
import { z } from "zod"

export const CreateTemplate = z.object({
  templateName: z.string().nonempty(),
})

export default resolver.pipe(resolver.zod(CreateTemplate), resolver.authorize(), async (data, ctx) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const userId = ctx.session.userId
  if (!userId) throw new AuthenticationError("No userId found in session")

  const user = await db.user.findUnique({ where: { id: userId } })
  if (!user) throw new AuthenticationError("User not found")

  const accountExec = await db.accountExecutive.findUnique({ where: { userId: userId } })
  if (!accountExec) throw new AuthenticationError("Template can only be created by an AE")

  const vendorTeam = await db.vendorTeam.findUnique({ where: { id: accountExec.vendorTeamId } })
  if (!vendorTeam) throw new AuthenticationError("No vendor team associated with AE when creating template")

  const templatePortal = await db.portal.create({
    data: {
      isTemplate: true,
      customerName: data.templateName,
      customerLogoUrl: "",
      currentRoadmapStage: 1,
      vendorId: vendorTeam.vendorId,
      userPortals: {
        create: {
          userId: userId,
          vendorId: vendorTeam.vendorId,
          role: Role.AccountExecutive,
          isPrimaryContact: true,
          isSecondaryContact: false,
        },
      },
      proposalHeading: "",
      proposalSubheading: "",
    },
  })

  // Now create template for this portal
  const template = await db.template.create({
    data: {
      name: data.templateName,
      proposalHeading: "",
      proposalSubheading: "",
      portalId: templatePortal.id,
      vendorId: ctx.session.vendorId,
    },
  })

  return templatePortal
})
