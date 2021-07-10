import nodemailer from "nodemailer"
import { BACKEND_ENDPOINT } from "../config"

const transporter = nodemailer.createTransport({
  host: "smtp.sendgrid.net",
  port: 465,
  auth: {
    user: "apikey",
    pass: "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"
  }
})

function magicLinkMessage(firstName: string, code: string) {
  return `
  <h1>${firstName} has shared a customer portal with you</h1>
  <br/>
  <a href="${BACKEND_ENDPOINT}/magicLink/${code}">Open Portal</a>
  `
}

export async function sendMagicLink(customerName: string,
                                    vendorName: string,
                                    inviterFirstName:string,
                                    inviteeEmailAddress: string,
                                    magicLink: string) {
  const info = await transporter.sendMail({
    from: `"Romeano" <welcome@romeano.com>`,
    to: "eric.semeniuc@gmail.com",
    // to: emailAddress,
    subject: `${customerName} Customer Portal Invitation - ${vendorName}`, // Subject line
    html: magicLinkMessage(inviterFirstName, magicLink)
  })

}
