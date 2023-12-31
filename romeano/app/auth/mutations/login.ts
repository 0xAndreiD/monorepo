import { resolver, SecurePassword, AuthenticationError } from "blitz"
import db from "db"
import { Login } from "../validations"
import { Role, SiteRole } from "db"
import { updateVendorIdInAllTablesForUser } from "app/core/utils"

export const authenticateUser = async (rawEmail: string, rawPassword: string) => {
  const email = rawEmail.toLowerCase().trim()
  const password = rawPassword.trim()
  const user = await db.user.findFirst({ where: { email } })
  if (!user) throw new AuthenticationError()

  var result = SecurePassword.VALID_NEEDS_REHASH
  result = await SecurePassword.verify(user.hashedPassword, password)

  if (result === SecurePassword.VALID_NEEDS_REHASH) {
    // Upgrade hashed password with a more secure hash
    const improvedHash = await SecurePassword.hash(password)
    await db.user.update({ where: { id: user.id }, data: { hashedPassword: improvedHash } })
  }

  const { hashedPassword, ...rest } = user
  return rest
}

export default resolver.pipe(resolver.zod(Login), async ({ email, password }, ctx) => {
  // This throws an error if credentials are invalid
  const user = await authenticateUser(email, password)
  let roles: Array<Role | SiteRole> = [user.role]

  // TODO: Add vendorId constraint in query after all user records have been migrated
  const accountExecutive = await db.accountExecutive.findFirst({
    where: {
      userId: user.id,
    },
  })
  if (accountExecutive) {
    roles.push(Role.AccountExecutive)
  }
  const stakeHolder = await db.stakeholder.findFirst({
    where: {
      userId: user.id,
    },
  })
  if (stakeHolder) {
    roles.push(Role.Stakeholder)
  }

  // TODO: Remove undefined vendorId when all data is migrated and column is made NON-NULLABLE
  await ctx.session.$create({
    userId: user.id!,
    roles: roles,
    vendorId: (accountExecutive?.vendorId || stakeHolder?.vendorId)!,
  })

  return user
})
