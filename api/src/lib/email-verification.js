import { logger } from 'src/lib/logger'
const verificationEmail = {
  subject: () => 'Verify Email',
  htmlBody: (user) => {
    const link = `${process.env.REDIRECT_URL}/verification?verifyToken=${user.verifyToken}`
    const appName = process.env.APP_NAME

    if (process.env.NODE_ENV === 'development') {
      logger.debug(link)
    }

    return `
          <div> Hi ${user.name}, </div>
          <p>Please find below a link to verify your email for the ${appName}:</p>
          <a href="${link}">${link}</a>
          <p>If you did not request this action, please ignore this email.</p>
          <p>We appreciate doing busines with you ❤️</p>
        `
  },
}

export { verificationEmail }
