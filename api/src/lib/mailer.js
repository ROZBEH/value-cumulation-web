import * as nodemailer from 'nodemailer'

export async function sendEmail({ to, subject, text, html }) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })
  console.log('before sending email')
  let info = await transporter.sendMail({
    from: process.env.AUTH_EMAIL_FROM,
    to: Array.isArray(to) ? to : [to],
    subject,
    text,
    html,
  })

  console.log('After sending email')
  console.log('Info: ', info)

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
