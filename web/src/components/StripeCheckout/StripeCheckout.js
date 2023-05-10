import { useEffect } from 'react'

import { toast } from 'react-toastify'

import { useMutation } from '@redwoodjs/web'

import { useAuth } from 'src/auth'
import { CREATE_CHECKOUT_SESSION } from 'src/commons/gql'

const StripeCheckout = () => {
  const { currentUser } = useAuth()

  const [createCheckoutSession, { error }] = useMutation(
    CREATE_CHECKOUT_SESSION
  )
  useEffect(() => {
    if (error) {
      toast.error('Error creating Stripe checkout session:', error)
    }
  }, [error])
  function timeout(delay) {
    return new Promise((res) => setTimeout(res, delay))
  }
  const redirectToCheckout = async () => {
    const checkoutButton = document.querySelector('#checkout-button')
    checkoutButton.disabled = true
    const priceId = 'price_1LlWpoGCTzbTVORHcCZ8iHOx' // Replace with the desired price ID
    try {
      const { data } = await createCheckoutSession({
        variables: { priceId, userId: currentUser.id },
      })
      const { sessionUrl } = data.createCheckoutSession

      // Open Stripe Checkout in a new window
      toast.success('Opening in a new window tab')
      await timeout(2000) //for 2 seconds delay
      const newWindow = window.open(sessionUrl, '_blank')

      // Check if the new window was blocked by a popup blocker
      if (
        !newWindow ||
        newWindow.closed ||
        typeof newWindow.closed === 'undefined'
      ) {
        alert(
          'A popup blocker may have prevented the Stripe Checkout from opening. Please disable the popup blocker and try again.'
        )
      }

      // Listen for the new window to close
      const checkWindowClosed = setInterval(() => {
        if (newWindow.closed) {
          clearInterval(checkWindowClosed)

          // Re-enable the button
          checkoutButton.disabled = false
        }
      }, 100)
    } catch (error) {
      toast.error('Error creating Stripe checkout session:', error)

      // Re-enable the button
      checkoutButton.disabled = false
    }
  }

  return (
    <button
      className="opacity-70 btn-primary rounded-lg bg-gray-600 py-3 px-2 font-semibold hover:bg-gray-400"
      id="checkout-button"
      onClick={redirectToCheckout}
    >
      Add Subscription
    </button>
  )
}

export default StripeCheckout
