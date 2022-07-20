import { resolver, SecurePassword } from "blitz"
import db, { Role } from "db"
import { Signup } from "app/auth/validations"
import { endsWith } from "lodash"
import { sendVendorSignupNotificationToAdmin, sendVendorWelcomeEmail } from "app/core/util/email"

export default resolver.pipe(
  resolver.zod(Signup),
  async ({ email, password, firstName, lastName, vendorName, vendorTeam, jobTitle }, ctx) => {
    const hashedPassword = await SecurePassword.hash(password.trim())

    const UNSUPPORTED_EMAIL_DOMAINS = [
      "gmail.com",
      "yahoo.com",
      "hotmail.com",
      "msn.com",
      "comcast.net",
      "icloud.com",
      "aol.com",
      "outlook.com",
      "msn.com",
    ]

    //get the email domain of the user signing up
    const emailTrimmed = email.toLowerCase().trim()
    const domain = emailTrimmed.substring(emailTrimmed.lastIndexOf("@") + 1)
    console.log("Domain", domain, UNSUPPORTED_EMAIL_DOMAINS.includes(domain))
    if (UNSUPPORTED_EMAIL_DOMAINS.includes(domain))
      throw new Error("Unsupported domain. Please enter your work email address.")

    // Check if user already exists with this email
    var userRecord = await db.user.findUnique({
      where: { email: emailTrimmed },
    })
    console.log("User...", userRecord)

    // Find the vendor with this email domain first and if one doesn't exist, create it
    var vendorRecord = await db.vendor.findUnique({
      where: { emailDomain: domain },
      select: { id: true, name: true, emailDomain: true },
    })
    console.log("Vendor...", vendorRecord)
    if (!vendorRecord) {
      console.log("Vendor not found, creating one", vendorName, domain)
      // Create vendor first
      vendorRecord = await db.vendor.create({
        data: {
          name: vendorName,
          emailDomain: domain,
        },
        select: { id: true, name: true, emailDomain: true },
      })
    }
    console.log("Vendor...", vendorRecord)

    // Find a vendor team with this vendor email domaoin first and if one doesn't exist, create it
    var vendorTeamRecord = await db.vendorTeam.findFirst({
      where: { vendorId: vendorRecord.id },
      select: { id: true, vendorId: true },
    })
    console.log("Vendor Team...", vendorTeamRecord)
    if (!vendorTeamRecord) {
      console.log("Vendor team not found, creating one")
      // Create vendor team
      vendorTeamRecord = await db.vendorTeam.create({
        data: {
          vendorId: vendorRecord.id,
        },
        select: { id: true, vendorId: true },
      })
    }
    console.log("Vendor Team...", vendorTeamRecord)

    if (!userRecord) {
      console.log("User not found, creating one", emailTrimmed)
      userRecord = await db.user.create({
        data: {
          firstName: firstName,
          lastName: lastName,
          email: emailTrimmed,
          hashedPassword,
          accountExecutive: {
            //make AE
            create: {
              jobTitle: jobTitle,
              vendorTeamId: vendorTeamRecord.id,
            },
          },
        },
        include: {
          accountExecutive: { include: { vendorTeam: { include: { vendor: true } } } },
        },
      })
    }

    // Send email notification to admin(s)
    console.log("Sending vendor sign up email notification to admin(s)")
    await sendVendorSignupNotificationToAdmin(emailTrimmed, firstName, lastName, jobTitle, vendorName)

    // TODO: send welcome email to AE
    console.log("Sending welcome email to vendor")
    await sendVendorWelcomeEmail(emailTrimmed, firstName, lastName)

    await ctx.session.$create({ userId: userRecord.id, role: userRecord.role as Role })
    return userRecord
  }
)
