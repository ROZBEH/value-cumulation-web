import { toast } from 'react-toastify'

import { useAuth } from '@redwoodjs/auth'
import { useMutation } from '@redwoodjs/web'

import { CREATE_BILLING_PORTAL_SESSION } from 'src/commons/gql'

function timeout(delay) {
  return new Promise((res) => setTimeout(res, delay))
}
const StripePortal = () => {
  const { currentUser } = useAuth()
  const [createBillingPortalSession] = useMutation(
    CREATE_BILLING_PORTAL_SESSION,
    {
      onCompleted: async ({ createBillingPortalSession }) => {
        const { url } = createBillingPortalSession
        // window.location.assign(url)
        // open in new tab
        toast.success('Opening in a new window tab')
        await timeout(2000) //for 2 seconds delay
        const newWindow = window.open(url, '_blank')
        if (
          !newWindow ||
          newWindow.closed ||
          typeof newWindow.closed === 'undefined'
        ) {
          alert(
            'A popup blocker may have prevented the Stripe Checkout from opening. Please disable the popup blocker and try again.'
          )
        }
      },
      onError: (error) => {
        toast.error('Error creating Stripe billing portal session:', error)
      },
    }
  )

  const redirectToBillingPortal = () => {
    const returnUrl = 'http://localhost:8910/' // Replace with your desired return URL
    const customerId = currentUser.id // Replace with the property storing the Stripe Customer ID
    createBillingPortalSession({ variables: { customerId, returnUrl } })
  }

  return (
    <button
      className="opacity-70 btn-primary rounded-lg bg-gray-600 py-3 px-2 font-semibold hover:bg-gray-400"
      onClick={redirectToBillingPortal}
    >
      Manage Subscription
    </button>
  )
}

export default StripePortal
