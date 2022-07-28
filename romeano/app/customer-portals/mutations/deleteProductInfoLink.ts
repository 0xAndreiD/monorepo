import { AuthenticationError, resolver, NotFoundError, AuthorizationError } from "blitz"
import db from "db"
import { z } from "zod"
import { decodeHashId } from "../../core/util/crypto"

export default resolver.pipe(async ({ ...data }, ctx) => {
  const currentUserId = ctx.session.userId
  if (!currentUserId) throw new AuthenticationError("no userId provided")

  console.log("DELETE LINK", data, currentUserId)
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const portal = await db.portal.findUnique({ where: { id: decodeHashId(data.portalId) } })
  if (!portal) throw new NotFoundError("customer portal not found")

  // Find link
  const link = await db.link.findUnique({
    where: {
      id: data.linkId,
    },
  })
  if (!link || link.userId !== currentUserId)
    throw new AuthorizationError("Link not found or does not belong to current user")
  console.log("Found Link", link)

  // Find section link
  const sectionLink = await db.productInfoSectionLink.findFirst({
    where: {
      productInfoSectionId: data.sectionId,
      linkId: data.linkId,
    },
  })
  if (!sectionLink) throw new AuthorizationError("Section link not found")
  console.log("Found Section Link", sectionLink)

  // // Delete product info section link and then link
  await db.productInfoSectionLink.delete({
    where: {
      id: sectionLink.id,
    },
  })
  await db.link.delete({
    where: {
      id: link.id,
    },
  })
  return
})
