import nodemailer from "nodemailer"
import { BACKEND_ENDPOINT } from "../config"
import previewEmail from "preview-email"
import { promisify } from "util"
const fs = require("fs")
import handlebars from "handlebars"
import path from "path"

const readFile = promisify(fs.readFile)

// TODO: Move this to env
export const ADMIN_EMAILS = [process.env.ADMIN_EMAIL || "ben@romeano.com"]
export const FROM_ADDRESS = "no-reply@romeano.com"

export const transporter = nodemailer.createTransport({
  host: "smtp.sendgrid.net",
  port: 465,
  auth: {
    user: "apikey",
    // pass: "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",
    pass: "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",
  },
})

export const recipientProcessor = (recipients: string[]) => {
  return process.env.NODE_ENV === "production" ? recipients : [process.env.DEV_EMAIL_RECIPIENT]
}

//invitation for a new stakeholder
export async function sendInvite(
  inviterEmail: string,
  customerName: string,
  vendorName: string,
  inviterFirstName: string,
  inviteeEmailAddress: string,
  magicLink: string,
  customerLogo: string,
  vendorLogo?: string
) {
  let html = await readFile("app/core/util/inviteEmail.html", "utf8")
  let template = handlebars.compile(html)
  const inviteUrl = `${BACKEND_ENDPOINT}/magicLink/${magicLink}`
  let inviteEmailData = {
    inviter_name: inviterFirstName,
    invite_url: inviteUrl,
    vendor_logo: vendorLogo ? `${BACKEND_ENDPOINT}` + vendorLogo : "",
    customer_logo: customerLogo ? `${BACKEND_ENDPOINT}` + customerLogo : "",
  }

  //use the handlebars object to inject custom template data into the email
  let preparedInviteHTMLEmail = template(inviteEmailData)

  const body = `<h1 >${inviterFirstName} has shared a customer portal with you</h1>
<br/>
<a href="${BACKEND_ENDPOINT}/magicLink/${magicLink}">Open Portal</a>`

  const msg = {
    from: `"${inviterFirstName}" <${FROM_ADDRESS}>`,
    to: recipientProcessor([inviteeEmailAddress]),
    subject: `${customerName} Customer Portal Invitation - ${vendorName}`, // Subject line
    html: preparedInviteHTMLEmail,
  }
  if (process.env.NODE_ENV !== "production") {
    // @ts-ignore: FIXME
    await previewEmail(msg)
    // @ts-ignore: FIXME
    const info = await transporter.sendMail(msg)
  } else {
    // @ts-ignore: FIXME
    const info = await transporter.sendMail(msg)
  }
}

//login for existing stakeholder
export async function sendPortalLoginLink(
  customerName: string,
  vendorName: string,
  inviterFirstName: string,
  inviteeEmailAddress: string,
  magicLink: string,
  inviteeFirstName: string
) {
  const body = `<p>Hi ${inviteeFirstName},</p>
<p>Please use <a href="${BACKEND_ENDPOINT}/magicLink/${magicLink}">this link</a> to re-login to your ${vendorName} sales portal! </p>

<div>Best,</div>
<div>Team ${vendorName}</div>
`

  const msg = {
    from: `"Romeano" <${FROM_ADDRESS}>`,
    to: recipientProcessor([inviteeEmailAddress]),
    subject: `Login to your ${vendorName} Sales Portal`, // Subject line
    html: body,
  }
  if (process.env.NODE_ENV !== "production") {
    // @ts-ignore: FIXME
    await previewEmail(msg)
    // @ts-ignore: FIXME
    const info = await transporter.sendMail(msg)
  } else {
    // @ts-ignore: FIXME
    const info = await transporter.sendMail(msg)
  }
}

// export async function sendAELoginLink(aeFirstName: string,
//                                       aeEmail: string,
//                                       magicLink: string) {
//   const body = `<h1>Hello!</h1>
// <p>
// You asked us to send you a magic link for quickly signing in to your buyer portal. Your wish is our command!
// </p>
// <br/>
// <a href="${BACKEND_ENDPOINT}/magicLink/${magicLink}">Sign in</a>`
//
//   const info = await transporter.sendMail({
//     from: `"Romeano" <${FROM_ADDRESS}>`,
//     to: recipientProcessor([aeEmail]),
//     subject: `Magic sign-in link for ${aeFirstName} on Romeano`, // Subject line
//     html: body
//   })
// }

// Notify Romeano Admin about self signed up accounts
export async function sendVendorSignupNotificationToAdmin(
  userEmail: string,
  userFirstName: string,
  userLastName: string,
  jobTitle: string,
  vendorName: string
) {
  const body = `<h1>Hello!</h1>
<p>
${userEmail} - ${userFirstName} ${userLastName} (${jobTitle} at ${vendorName}) has signed up for an account on Romeano. 
Please make sure you update the vendor logo if it is not already in the system. 
</p>
<br/>
`

  const msg = {
    from: `"Romeano" <${FROM_ADDRESS}>`,
    to: recipientProcessor(ADMIN_EMAILS),
    subject: `Vendor Self Sign Up - ${userFirstName} ${userLastName} (${jobTitle} at ${vendorName})`, // Subject line
    html: body,
  }
  if (process.env.NODE_ENV !== "production") {
    // @ts-ignore: FIXME
    await previewEmail(msg)
    // @ts-ignore: FIXME
    const info = await transporter.sendMail(msg)
  } else {
    // @ts-ignore: FIXME
    const info = await transporter.sendMail(msg)
  }
}

// Welcome email to vendor email
export async function sendVendorWelcomeEmail(userEmail: string, userFirstName: string, userLastName: string) {
  const body = `<p>Hi ${userFirstName},</p>
<p>Please bookmark this link for future reference -</p>
<ul><li>Beta Link: <a href="http://app.romeano.com">app.romeano.com</a></li></ul>
<p>We're excited to have you onboard our Beta.</p>

<div>Best,</div>
<div>Ben Du</div>
<div>Romeano | <a href="mailto:ben@romeano.com">ben@romeano.com</a></div>
`
  const msg = {
    from: `"Romeano" <${FROM_ADDRESS}>`,
    to: recipientProcessor([userEmail]),
    subject: `Welcome to Romeano's Beta`, // Subject line
    html: body,
  }
  if (process.env.NODE_ENV !== "production") {
    // @ts-ignore: FIXME
    await previewEmail(msg)
    // @ts-ignore: FIXME
    const info = await transporter.sendMail(msg)
  } else {
    // @ts-ignore: FIXME
    const info = await transporter.sendMail(msg)
  }
}
