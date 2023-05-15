/**
Value Cumulation
Copyright (c) 2022 Value Cumulation

Notice: All code and information in this repository is the property of Value Cumulation.
You are strictly prohibited from distributing or using this repository unless otherwise stated.
 */

import { randomUUID } from 'crypto'

import { DbAuthHandler } from '@redwoodjs/auth-dbauth-api'

import { db } from 'src/lib/db'
import { logger } from 'src/lib/logger'
import { sendEmail } from 'src/lib/mailer'
// import { logger } from 'src/lib/logger'
import { stripe } from 'src/lib/stripe'
export const cors = {
  origin: [
    'http://0.0.0.0:8910',
    'http://localhost:8910',
    'http://localhost',
    'http://10.0.2.2:8910',
  ],
  credentials: true,
}
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
export const handler = async (event, context) => {
  const forgotPasswordOptions = {
    // handler() is invoked after verifying that a user was found with the given
    // username. This is where you can send the user an email with a link to
    // reset their password. With the default dbAuth routes and field names, the
    // URL to reset the password will be:
    //
    // https://example.com/reset-password?resetToken=${user.resetToken}
    //
    // Whatever is returned from this function will be returned from
    // the `forgotPassword()` function that is destructured from `useAuth()`
    // You could use this return value to, for example, show the email
    // address in a toast message so the user will know it worked and where
    // to look for the email.
    handler: async (user) => {
      const resetLink = `${process.env.REDIRECT_URL}/reset-password?resetToken=${user.resetToken}`
      const message = {
        to: user.email,
        subject: 'Reset Password',
        html: `
        <p>Here is the link to reset your password. It will expire after 5 minutes. <a href="${resetLink}">Reset my Password</a></p>
        <p> Please copy and paste the following link into your browser if the above link does not work.</p>
        <p>${resetLink}</p>
        <p>If you did not request a password reset, please ignore this email.</p>
        <p>We appreciate doing busines with you ❤️</p>`,
      }
      await sendEmail(message)

      return user
    },

    // How long the resetToken is valid for, in seconds (default is 5minutes)
    expires: 60 * 5,

    errors: {
      // for security reasons you may want to be vague here rather than expose
      // the fact that the email address wasn't found (prevents fishing for
      // valid email addresses)
      usernameNotFound: 'Username not found',
      // if the user somehow gets around client validation
      usernameRequired: 'Username is required',
    },
  }

  const loginOptions = {
    // handler() is called after finding the user that matches the
    // username/password provided at login, but before actually considering them
    // logged in. The `user` argument will be the user in the database that
    // matched the username/password.
    //
    // If you want to allow this user to log in simply return the user.
    //
    // If you want to prevent someone logging in for another reason (maybe they
    // didn't validate their email yet), throw an error and it will be returned
    // by the `logIn()` function from `useAuth()` in the form of:
    // `{ message: 'Error message' }`
    handler: (user) => {
      // if (user.verifyToken) {
      //   throw new Error('Please check your email to verify your account.')
      // }
      console.log('user inside handler:', user)
      return user
    },

    errors: {
      usernameOrPasswordMissing: 'Both username and password are required',
      usernameNotFound: 'Invalid username or password',
      // For security reasons you may want to make this the same as the
      // usernameNotFound error so that a malicious user can't use the error
      // to narrow down if it's the username or password that's incorrect
      incorrectPassword: 'Invalid username or password',
    },

    // How long a user will remain logged in, in seconds
    expires: 60 * 60 * 24 * 365 * 10,
  }

  const resetPasswordOptions = {
    // handler() is invoked after the password has been successfully updated in
    // the database. Returning anything truthy will automatically logs the user
    // in. Return `false` otherwise, and in the Reset Password page redirect the
    // user to the login page.
    handler: (user) => {
      return user
    },

    // If `false` then the new password MUST be different than the current one
    allowReusedPassword: false,

    errors: {
      // the resetToken is valid, but expired
      resetTokenExpired: 'resetToken is expired',
      // no user was found with the given resetToken
      resetTokenInvalid: 'resetToken is invalid',
      // the resetToken was not present in the URL
      resetTokenRequired: 'resetToken is required',
      // new password is the same as the old password (apparently they did not forget it)
      reusedPassword: 'Must choose a new password',
    },
  }

  const signupOptions = {
    // Whatever you want to happen to your data on new user signup. Redwood will
    // check for duplicate usernames before calling this handler. At a minimum
    // you need to save the `username`, `hashedPassword` and `salt` to your
    // user table. `userAttributes` contains any additional object members that
    // were included in the object given to the `signUp()` function you got
    // from `useAuth()`.
    //
    // If you want the user to be immediately logged in, return the user that
    // was created.
    //
    // If this handler throws an error, it will be returned by the `signUp()`
    // function in the form of: `{ error: 'Error message' }`.
    //
    // If this returns anything else, it will be returned by the
    // `signUp()` function in the form of: `{ message: 'String here' }`.
    handler: async ({
      username: email,
      hashedPassword: hashedPassword,
      salt,
      userAttributes,
    }) => {
      // get customerID from Stripe using email
      const customerList = await stripe.customers.list({ email })
      let customerId = ''
      let customerName = userAttributes.name
      if (customerList.data.length > 0) {
        customerId = customerList.data[0].id
        customerName = customerList.data[0].name
      } else {
        const newCustomer = await stripe.customers.create({
          email,
          name: customerName,
        })
        customerId = newCustomer.id
      }
      const user = await db.user.create({
        data: {
          id: customerId,
          email,
          hashedPassword: hashedPassword,
          salt: salt,
          name: customerName,
          verifyToken: randomUUID(),
          // name: userAttributes.name
        },
      })

      await Promise.all([
        sendEmail({
          to: user.email,
          subject: verificationEmail.subject(),
          html: verificationEmail.htmlBody(user),
        }),
        sendEmail({
          to: 'rouzbeh.asghari@gmail.com',
          subject: 'New User Signed Up',
          html: `<p>${user.name} with the email ${user.email} signed up</p>`,
        }),
      ])

      const msg = '🙏 Please check your email to verify your account.'

      // return msg
      return user
    },

    passwordValidation: (password) => {
      if (password.length < 8) {
        throw new PasswordValidationError(
          'Password must be at least 8 characters'
        )
      }

      if (!password.match(/[A-Z]/)) {
        {
          throw new PasswordValidationError(
            'Password must contain at least one uppercase letter'
          )
        }
      }
      if (!password.match(/[a-z]/)) {
        {
          throw new PasswordValidationError(
            'Password must contain at least one lowercase letter'
          )
        }
      }
      if (!password.match(/[0-9]/)) {
        {
          throw new PasswordValidationError(
            'Password must contain at least one number'
          )
        }
      }
      if (!password.match(/[!@#$%^&*()]/)) {
        {
          throw new PasswordValidationError(
            'Password must contain at least one special character'
          )
        }
      }

      return true
    },

    errors: {
      // `field` will be either "username" or "password"
      fieldMissing: '${field} is required',
      usernameTaken: 'Username `${username}` already in use',
    },
  }

  const authHandler = new DbAuthHandler(event, context, {
    // Provide prisma db client
    db: db,

    // The name of the property you'd call on `db` to access your user table.
    // ie. if your Prisma model is named `User` this value would be `user`, as in `db.user`
    authModelAccessor: 'user',
    // cors,
    // authFields: {
    //   id: 'id',
    //   username: 'username',
    // },

    // A map of what dbAuth calls a field to what your database calls it.
    // `id` is whatever column you use to uniquely identify a user (probably
    // something like `id` or `userId` or even `email`)
    authFields: {
      id: 'id',
      username: 'email',
      hashedPassword: 'hashedPassword',
      salt: 'salt',
      resetToken: 'resetToken',
      resetTokenExpiresAt: 'resetTokenExpiresAt',
      // favoriteMetrics: 'favoriteMetrics',
    },

    // Specifies attributes on the cookie that dbAuth sets in order to remember
    // who is logged in. See https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies#restrict_access_to_cookies
    cookie: {
      HttpOnly: true,
      Path: '/',
      SameSite: 'Strict',
      Secure: process.env.NODE_ENV !== 'development' ? true : false,

      // If you need to allow other domains (besides the api side) access to
      // the dbAuth session cookie:
      // Domain: 'example.com',
    },

    forgotPassword: forgotPasswordOptions,
    login: loginOptions,
    resetPassword: resetPasswordOptions,
    signup: signupOptions,
  })

  // authHandler.login = async () => {
  //   const { code, state } = authHandler.params
  //   console.log('authHandler.params = ', authHandler.params)
  //   return true
  //   // validateLoginRequest({ type })
  //   // if (!code || !state) throw 'logIn() Code or state not provided.'

  //   // const tokens = await submitCodeGrant({
  //   //   state,
  //   //   code,
  //   //   type,
  //   // })
  //   // const user = await providers[type].onConnected(tokens)
  //   // const sessionData = { id: user[authHandler.options.authFields.id] }

  //   // // TODO: this needs to go into graphql somewhere so that each request makes
  //   // // a new CSRF token and sets it in both the encrypted session and the
  //   // // csrf-token header
  //   // const csrfToken = DbAuthHandler.CSRF_TOKEN

  //   // const response = [
  //   //   sessionData,
  //   //   {
  //   //     'csrf-token': csrfToken,
  //   //     ...authHandler._createSessionHeader(sessionData, csrfToken),
  //   //   },
  //   // ]
  //   // logger.debug({ custom: response }, 'login() cookie')
  //   // return response
  // }

  // const originalLogin = authHandler.login

  authHandler.login = async (user) => {
    console.log('inside the  newly defined login function!')
    console.log('user:', user)
    const usr = {
      id: 'cus_NssOD0je7EFzF2',
      email: 'rouzbeh.asghari@gmail.com',
    }
    const loginResponse = authHandler._loginResponse(usr)
    console.log('loginResponse:', loginResponse)

    return loginResponse
  }
  //   // googleId: null,
  //   // name: 'Rouzbeh Shirvani',
  // }
  // console.log('user:', user)
  // const loginResponse = authHandler._loginResponse(user)
  // console.log('loginResponse:', loginResponse)
  // return loginResponse

  // console.log('inside the newly defined login function!')
  // console.log('authHandler.params:', authHandler.params)
  // const { type, username, password } = authHandler.params
  // console.log('params:', authHandler.params)
  // return loginResponse

  // if (type) {
  //   // assume type is only present for OAuth logins

  //   console.log('type:', type)
  //   return { response: 'type' }
  // } else if (username && password) {
  //   // assume both are present for traditional logins
  //   // Call the original login method
  //   const callOriginalLogin = originalLogin.call(authHandler)
  //   console.log('callOriginalLogin:', callOriginalLogin)
  //   return callOriginalLogin
  // } else {
  //   // ...handle case where necessary parameters are missing...
  //   throw 'logIn() Username, password or OAuth details not provided.'
  // }
  // }

  return await authHandler.invoke()
}
