import { resolver } from "blitz"
import db from "db"

export default resolver.pipe(resolver.authorize(), async (params, ctx) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant

    const data = await db.$queryRaw<Array<{
      vendorName: string,
      firstName: string,
      lastName: string,
      email: string,
      hasStakeholderApproved: boolean,
      portalId: number
    }>>`
      SELECT V.name                       AS "vendorName",
             U."firstName",
             U."lastName",
             U."email",
             UP1."hasStakeholderApproved" AS status,
             UP1."portalId",
             UP1.role
      FROM "UserPortal" UP1
             JOIN "UserPortal" UP2 ON UP1."portalId" = UP2."portalId" AND UP2.role = 'AccountExecutive'
             JOIN "Portal" P on P.id = UP1."portalId"
             JOIN "Vendor" V on P."vendorId" = V.id
             JOIN "User" U ON UP2."userId" = U.id
      WHERE UP1."userId" = ${ctx.session.userId}
        AND UP2."isPrimaryContact" IS TRUE
      ORDER BY P.id DESC;
    `
    return data
  }
)
