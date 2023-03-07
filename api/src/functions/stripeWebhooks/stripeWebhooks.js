/**
Value Cumulation
Copyright (c) 2022 Value Cumulation

Notice: All code and information in this repository is the property of Value Cumulation.
You are strictly prohibited from distributing or using this repository unless otherwise stated.
 */
import { handleStripeWebhooks } from 'src/lib/stripe'
import { createSubscription } from 'src/services/subscriptions/subscriptions'
import { handleDBSync } from 'src/services/users'

/**
 * The handler function is your code that processes http request events.
 * You can use return and throw to send a response or error, respectively.
 *
 * Important: When deployed, a custom serverless function is an open API endpoint and
 * is your responsibility to secure appropriately.
 *
 * @see {@link https://redwoodjs.com/docs/serverless-functions#security-considerations|Serverless Function Considerations}
 * in the RedwoodJS documentation for more information.
 *
 * @typedef { import('aws-lambda').APIGatewayEvent } APIGatewayEvent
 * @typedef { import('aws-lambda').Context } Context
 * @param { APIGatewayEvent } event - an object which contains information from the invoker.
 * @param { Context } context - contains information about the invocation,
 * function, and execution environment.
 */

/*
 * Stripe documentation recommends making any calls to db for syncing inside of webhooks
 */
export const handler = async (event, context) => {
  // Create services to handle webhooks
  const results = await handleStripeWebhooks(event, context, {
    'checkout.session.completed': (e) => e.type,
    'checkout.session.async_payment_succeeded': (e) => e.type,
    'checkout.session.async_payment_failed': (e) => e.type,
    'customer.updated': async (e) => {
      const {
        data: { object },
      } = JSON.parse(e.body)
      const results = await handleDBSync(object.id, object.name, object.email)
      if (results) {
        console.log('Database has been synced successfully')
      }
      return JSON.parse(e.body)
    },
    'customer.subscription.created': async (e) => {
      const {
        data: { object },
      } = JSON.parse(e.body)
      var interval
      if (object.plan.interval.toUpperCase() === 'MONTH') {
        interval = 'MONTHLY'
      } else if (object.plan.interval.toUpperCase() === 'YEAR') {
        interval = 'YEARLY'
      } else if (object.plan.interval.toUpperCase() === 'WEEK') {
        interval = 'WEEKLY'
      } else if (object.plan.interval.toUpperCase() === 'DAY') {
        interval = 'DAILY'
      } else {
        // raise error
        throw new Error(`Unrecognized interval: ${object.plan.interval}`)
      }
      const subscriberInfo = {
        subscriptionName: object.plan.product,
        price: object.plan.amount,
        interval,
        userId: object.customer,
      }
      console.log('subscriberInfo: ', subscriberInfo)
      try {
        // Update the subscription table for the user
        const results = await createSubscription({ input: subscriberInfo })
        if (results) {
          console.log('Database has been synced successfully')
        }
      } catch (err) {
        console.log('error: ', err)
      }

      return JSON.parse(e.body)
    },
    'customer.subscription.updated': async (e) => JSON.parse(e.body),
    'customer.subscription.deleted': async (e) => JSON.parse(e.body),
    'customer.subscription.resumed': async (e) => JSON.parse(e.body),
    'customer.subscription.trial_will_end': async (e) => JSON.parse(e.body),
  })

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      data: results,
    }),
  }
}
