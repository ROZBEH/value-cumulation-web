/**
Value Cumulation
Copyright (c) 2022 Value Cumulation

Notice: All code and information in this repository is the property of Value Cumulation.
You are strictly prohibited from distributing or using this repository unless otherwise stated.
 */
import { google } from 'googleapis'
import jwt from 'jsonwebtoken'

import { DbAuthHandler } from '@redwoodjs/auth-dbauth-api'

import { handler as handleAuth } from 'src/functions/auth'
import { db } from 'src/lib/db'
import { stripe } from 'src/lib/stripe'
// Use a long random string for your secret
const JWT_SECRET = process.env.JWT_SECRET

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is not set')
}

async function createSessionTokenForUser(user) {
  // Define the payload. This will be the data that's encoded in the token.
  // `sub` is a reserved property for the "subject" of the token, typically the user ID.
  const payload = { sub: user.id }

  // Create and sign the token. `sign()` is asynchronous if you provide a callback, but synchronous otherwise.
  // This token will expire in 1 day.
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' })

  return token
}

export const googlelogin = async ({ idToken }) => {
  // Use Google's client to verify the token
  const client = new google.auth.OAuth2(process.env.GOOGLE_CLIENT_ID)
  const ticket = await client.verifyIdToken({
    idToken: idToken,
    audience: process.env.GOOGLE_CLIENT_ID,
  })
  const payload = ticket.getPayload()

  const userid = payload['sub']

  // Find or create the user in your database
  let user = await db.user.findUnique({
    where: { googleId: userid },
  })

  if (!user) {
    // Create the stripe account first
    const customerList = await stripe.customers.list({
      email: payload['email'],
    })
    var customerId = ''
    var customerName = payload['given_name'] + ' ' + payload['family_name']
    if (customerList.data.length > 0) {
      customerId = customerList.data[0].id
      customerName = customerList.data[0].name
    } else {
      const newCustomer = await stripe.customers.create({
        email: payload['email'],
        name: customerName,
      })
      customerId = newCustomer.id
    }
    user = await db.user.create({
      data: {
        id: customerId,
        email: payload['email'],
        name: customerName,
        googleId: userid,
      },
    })
  }

  // At this point, you have a user record in your database.
  // You can now sign them in. You'll need to generate a session token.
  // Here, I'll assume you have a way to do this:
  const sessionToken = await createSessionTokenForUser(user)
  const authHandler = new DbAuthHandler({
    // Provide prisma db client
    cookie: {
      HttpOnly: true,
      Path: '/',
      SameSite: 'Strict',
      Secure: process.env.NODE_ENV !== 'development' ? true : false,
    },
    db: db,

    authModelAccessor: 'user',

    authFields: {
      id: 'id',
      username: 'email',
      hashedPassword: 'hashedPassword',
      salt: 'salt',
      resetToken: 'resetToken',
      resetTokenExpiresAt: 'resetTokenExpiresAt',
      // favoriteMetrics: 'favoriteMetrics',
    },
  })

  authHandler.login = async (user) => {
    const loginResponse = authHandler._loginResponse(user)
    return loginResponse
  }

  const logInResponse = authHandler.login({
    id: customerId,
    email: payload['email'],
  })
  console.log('After handleAuth')
  console.log('logInResponse: ', logInResponse)

  return {
    status: 'success',
    sessionToken: sessionToken,
  }
}
