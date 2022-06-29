import { resolver, SecurePassword } from "blitz"
import db, { Role } from "db"
import { Signup } from "app/auth/validations"
import { endsWith } from "lodash"

export default resolver.pipe(resolver.zod(Signup), async ({ email, password }, ctx) => {
  const hashedPassword = await SecurePassword.hash(password.trim())

  //get the email domain of the user signing up
  const domain = email.substring(email.lastIndexOf("@") + 1)

  //find a user that already uses this domain
  const existingUser = await db.user.findFirst({
    where: {
      email: {
        endsWith: domain,
      },
      accountExecutive: {
        isNot: null,
      },
    },
    include: {
      accountExecutive: { include: { vendorTeam: { include: { vendor: true } } } },
    },
  })

  // this verifies that a vendor team actually exists, and if so, attaches the user to it
  if (existingUser) {
    if (existingUser.accountExecutive != null) {
      //TODO: Change functionality for if the vendor is not signed up
      const vendorTeamId = existingUser.accountExecutive.vendorTeamId

      const user = await db.user.create({
        data: {
          firstName: "Test",
          lastName: "User",
          email: email.toLowerCase().trim(),
          hashedPassword,
          accountExecutive: {
            //make AE
            create: {
              jobTitle: "Account Executive",
              vendorTeamId: vendorTeamId,
            },
          },
        },
        select: { id: true, firstName: true, email: true, role: true },
      })

      await ctx.session.$create({ userId: user.id, role: user.role as Role })
      return user

      //if the vendor team does not exist, return null and do not process the sign up
    } else {
      return null
    }
  } else {
    return null
  }
})
