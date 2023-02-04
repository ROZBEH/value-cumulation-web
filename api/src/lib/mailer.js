import * as nodemailer from 'nodemailer'

import { logger } from 'src/lib/logger'

export async function sendEmail({ to, subject, text, html }) {
  //   if (process.env.DISABLE_EMAIL === 'true') {
  //     return
  //   }
  console.log('Inside sendEmail function')
  console.log('process.env.SMTP_HOST: ', process.env.SMTP_HOST)
  console.log('process.env.SMTP_PORT: ', process.env.SMTP_PORT)
  console.log('process.env.SMTP_USER: ', process.env.SMTP_USER)

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })
  console.log('Before transporter.sendMail')

  let info = await transporter.sendMail({
    from: process.env.AUTH_EMAIL_FROM,
    to: Array.isArray(to) ? to : [to],
    subject,
    text,
    html,
  })

  console.log('info after transporter.sendMail: ', info)

  if (info.messageId) {
    return {
      statusCode: 200,
      body: nodemailer.getTestMessageUrl(info),
    }
  }

  return {
    statusCode: 400,
    body: 'Oops',
  }
}
