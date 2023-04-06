/**
Value Cumulation
Copyright (c) 2022 Value Cumulation

Notice: All code and information in this repository is the property of Value Cumulation.
You are strictly prohibited from distributing or using this repository unless otherwise stated.
 */
// import BillingPortal from 'src/components/BillingPortal'
// import Product from 'src/components/Product'
import StripeCheckout from 'src/components/StripeCheckout/StripeCheckout'
import StripePortal from 'src/components/StripePortal/StripePortal'
export const QUERY = gql`
  query SubscriptionHistory($userId: ID!) {
    subscriptionHistory: subscriptionHistory(userId: $userId) {
      hadSubscription
      status
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Empty</div>

export const Failure = ({ error }) => (
  <div style={{ color: 'red' }}>Error: {error.message}</div>
)

export const Success = ({ subscriptionHistory }) => {
  // If already had subscription, show them the Portal otherwise show them the checkout page
  if (subscriptionHistory.hadSubscription) {
    return <StripePortal />
  } else {
    return <StripeCheckout />
  }
}
