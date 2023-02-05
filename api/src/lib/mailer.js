import * as nodemailer from 'nodemailer'

export async function sendEmail({ to, subject, text, html }) {
  // const transporter = nodemailer.createTransport({
  //   host: process.env.SMTP_HOST,
  //   port: process.env.SMTP_PORT,
  //   secure: false,
  //   auth: {
  //     user: process.env.SMTP_USER,
  //     pass: process.env.SMTP_PASS,
  //   },
  // })
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
      clientId: process.env.SMTP_CLIENT_ID,
      clientSecret: process.env.SMTP_CLIENT_SECRET,
      refreshToken: process.env.SMTP_REFRESH_TOKEN,
    },
  })
  console.log('before sending email')
  return await transporter.sendMail({
    from: process.env.AUTH_EMAIL_FROM,
    to: Array.isArray(to) ? to : [to],
    subject,
    text,
    html,
  })

  // if (info.messageId) {
  //   return {
  //     statusCode: 200,
  //     body: nodemailer.getTestMessageUrl(info),
  //   }
  // }

  // return {
  //   statusCode: 400,
  //   body: 'Oops',
  // }
}
