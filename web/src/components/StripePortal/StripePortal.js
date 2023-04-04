import { useAuth } from '@redwoodjs/auth'
import { useMutation } from '@redwoodjs/web'

import { CREATE_BILLING_PORTAL_SESSION } from 'src/commons/gql'

const StripePortal = () => {
  const { currentUser } = useAuth()
  const [createBillingPortalSession] = useMutation(
    CREATE_BILLING_PORTAL_SESSION,
    {
      onCompleted: ({ createBillingPortalSession }) => {
        const { url } = createBillingPortalSession
        window.location.assign(url)
      },
      onError: (error) => {
        console.error('Error creating Stripe billing portal session:', error)
      },
    }
  )

  const redirectToBillingPortal = () => {
    const returnUrl = 'http://localhost:8910/' // Replace with your desired return URL
    const customerId = currentUser.id // Replace with the property storing the Stripe Customer ID
    createBillingPortalSession({ variables: { customerId, returnUrl } })
  }

  return <button onClick={redirectToBillingPortal}>Manage Subscription</button>
}

export default StripePortal
