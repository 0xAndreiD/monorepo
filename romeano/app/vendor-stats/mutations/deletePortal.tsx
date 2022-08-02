import { StakeholderApprovalCircles } from "app/core/components/generic/StakeholderApprovalCircles"
import { resolver } from "blitz"
import db from "db"
// import { configStyleValidator } from "react-html-email"
import { z } from "zod"

import { encodeHashId, decodeHashId } from "../../core/util/crypto"

const DeletePortal = z.object({
  thisPortalId: z.string(),
})

export default resolver.pipe(
  resolver.zod(DeletePortal),
  resolver.authorize(),
  async ({ thisPortalId, ...data }, ctx) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const userId = ctx.session.userId

    //TODO FIXME: make sure delete is only for vendor (created by customer)
    return await db.userPortal.delete({
      where: { userId_portalId: { userId: userId, portalId: decodeHashId(thisPortalId) } },
    })

    // TODO: make sure to delete orphaned Stakeholders and Users?
  }
)
