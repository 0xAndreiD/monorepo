/* TODO - You need to add a mailer integration in `integrations/` and import here.
 *
 * The integration file can be very simple. Instantiate the email client
 * and then export it. That way you can import here and anywhere else
 * and use it straight away.
 */
import { BACKEND_ENDPOINT } from "app/core/config"
import previewEmail from "preview-email"
import { transporter, FROM_ADDRESS, recipientProcessor } from "../app/core/util/email"

type ResetPasswordMailer = {
  to: string
  token: string
}

export function forgotPasswordMailer({ to, token }: ResetPasswordMailer) {
  const resetUrl = `${BACKEND_ENDPOINT}/reset-password?token=${token}`
  const recipients = recipientProcessor([to])
  const msg = {
    from: `"Romeano" <${FROM_ADDRESS}>`,
    to: recipients[0],
    subject: "Your Password Reset Instructions",
    html: `
      <h1>Reset Your Password</h1>
      <a href="${resetUrl}">
        Click here to set a new password
      </a>
    `,
  }

  return {
    async send() {
      if (process.env.NODE_ENV === "production") {
        await transporter.sendMail(msg)
      } else {
        // Preview email in the browser
        await previewEmail(msg)
        await transporter.sendMail(msg)
      }
    },
  }
}
