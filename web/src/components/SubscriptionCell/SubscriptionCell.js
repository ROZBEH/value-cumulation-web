import BillingPortal from 'src/components/BillingPortal'
import Product from 'src/components/Product'
export const QUERY = gql`
  query SubscriptionHistory($userId: ID!) {
    subscriptionHistory: subscriptionHistory(userId: $userId) {
      hadSubscription
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Empty</div>

export const Failure = ({ error }) => (
  <div style={{ color: 'red' }}>Error: {error.message}</div>
)

export const Success = ({ subscriptionHistory }) => {
  // If already had subscription, show them the Portal otherwise show them the checkout
  if (subscriptionHistory.hadSubscription) {
    return <BillingPortal />
  } else {
    return <Product />
  }
}
