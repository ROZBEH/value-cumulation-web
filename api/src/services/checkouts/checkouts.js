/**
Value Cumulation
Copyright (c) 2022 Value Cumulation

Notice: All code and information in this repository is the property of Value Cumulation.
You are strictly prohibited from distributing or using this repository unless otherwise stated.
 */
import { db } from 'src/lib/db'
import { stripe } from 'src/lib/stripe'

/**
 * @type {'payment' | 'subscription'} Mode
 * @type {{ id: string, quantity: number }} Cart
 *
 * @param {{
 *  mode: Mode
 *  cart: Cart
 *  customerId: string
 * }}
 */
export const checkout = async ({ mode, cart, customerId }, { context }) => {
  // eslint-disable-next-line camelcase
  const line_items = cart.map((product) => ({
    price: product.id,
    quantity: product.quantity,
  }))

  const resCheckoutSession = await stripe.checkout.sessions.create({
    // See https://stripe.com/docs/payments/checkout/custom-success-page#modify-success-url.
    success_url: `${context.event.headers.referer}`,
    // For cancelling the checkout, we'll just redirect back to the mainpage
    // In order to redirect to a different page, simply change the URL below to something
    // else, like /canceled `${context.event.headers.referer}faiure`
    cancel_url: `${context.event.headers.referer}`,
    subscription_data: {
      trial_period_days: 14,
    },
    // eslint-disable-next-line camelcase
    line_items,
    mode,
    payment_method_types: ['card'],
    customer: customerId,
  })

  return resCheckoutSession
}

export const getSession = async ({ id }) => {
  // Get session object
  const session = await stripe.checkout.sessions.retrieve(id)

  // Use customer to find out whether customer has signed up before
  const user = await db.user.findUnique({
    where: { email: session.customer_details.email },
  })

  const isSignedUp = !!user

  return {
    id: session.id,
    customerId: session.customer,
    customerName: session.customer_details.name,
    customerEmail: session.customer_details.email,
    customerSignedUp: isSignedUp,
  }
}

export const createCheckoutSession = async ({ priceId, userId }) => {
  // requireAuth()

  // Optional: Retrieve or create a user in your database
  // const user = await db.user.findUnique({ where: { id: userId } });

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: 'http://localhost:8910/',
    cancel_url: 'http://localhost:8910/',
    subscription_data: {
      trial_period_days: 14,
    },

    customer: userId,
  })

  return { sessionId: session.id, sessionUrl: session.url }
}

export const createBillingPortalSession = async ({ customerId, returnUrl }) => {
  const portalSession = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  })

  return { url: portalSession.url }
}
