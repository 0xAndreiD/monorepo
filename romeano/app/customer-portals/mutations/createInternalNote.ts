import { AuthenticationError, resolver } from "blitz"
import db from "db"
import { z } from "zod"

export const CreateInternalNote = z.object({
  portalId: z.number(),
  message: z.string().nonempty()
})

export default resolver.pipe(resolver.zod(CreateInternalNote),
  resolver.authorize(),
  async ({ portalId, message }, ctx) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const userId = ctx.session.userId
    if (!userId) throw new AuthenticationError("no userId provided")

    const note = await db.internalNote.create({
      data: {
        portalId,
        message,
        userId
      }
    })

    return note
  })
