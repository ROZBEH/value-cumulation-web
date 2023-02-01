import * as nodemailer from 'nodemailer'

import { logger } from 'src/lib/logger'

export async function sendEmail({ to, subject, text, html }) {
  //   if (process.env.DISABLE_EMAIL === 'true') {
  //     return
  //   }
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })

  return transporter.sendMail(
    {
      from: process.env.AUTH_EMAIL_FROM,
      to: Array.isArray(to) ? to : [to],
      subject,
      text,
      html,
    },
    (error) => {
      if (error) {
        logger.error(
          `Failed to send '${subject}' email, check SMTP configuration`
        )
        logger.debug('This error can be ignored in development')
        logger.error(error)
      }
    }
  )
}
