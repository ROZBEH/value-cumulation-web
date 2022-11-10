import { stripe } from 'src/lib/stripe'
/**
 * @param {{ userId: int }}
 */
export const portal = async ({ userId }) => {
  // eslint-disable-next-line camelcase
  // Create Customer Portal session and send temp url to web side
  return await stripe.billingPortal.sessions.create({
    customer: userId,
    return_url: `${
      context.request?.headers?.referer ?? 'http://localhost:8910'
    }`,
  })
}

export const subscriptionHistory = async ({ userId }) => {
  // Take the user information and see whether the user has subscribed to any plans
  const customerSubscription = await stripe.subscriptions.list({
    customer: userId,
  })
  // If the user has subscribed to any plans, return the plan information
  if (customerSubscription.data.length > 0) {
    return { hadSubscription: true }
  } else {
    return { hadSubscription: false }
  }
}
