import { useStripe } from '@stripe/react-stripe-js'

import { useAuth } from '@redwoodjs/auth'
import { useMutation } from '@redwoodjs/web'

import { CREATE_CHECKOUT_SESSION } from 'src/commons/gql'

const StripeCheckout = () => {
  const { currentUser } = useAuth()
  const stripe = useStripe()
  const [createCheckoutSession] = useMutation(CREATE_CHECKOUT_SESSION, {
    onCompleted: async ({ createCheckoutSession }) => {
      const { sessionId } = createCheckoutSession
      await stripe.redirectToCheckout({ sessionId })
    },
    onError: (error) => {
      console.error('Error creating Stripe checkout session:', error)
    },
  })

  const redirectToCheckout = () => {
    const priceId = 'price_1LlWpoGCTzbTVORHcCZ8iHOx' // Replace with the desired price ID
    createCheckoutSession({ variables: { priceId, userId: currentUser.id } })
  }

  return <button onClick={redirectToCheckout}>Manage Subscription</button>
}

export default StripeCheckout
