import { Tooltip } from '@material-ui/core'
import { Subscriptions } from '@material-ui/icons'

// import { User } from 'react-feather'
import { useAuth } from '@redwoodjs/auth'
import { routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import Button from 'src/components/Button'

const BillingPortal = (props) => {
  const { isAuthenticated, _logOut, currentUser } = useAuth()

  const [portal] = useMutation(
    gql`
      mutation Portal($userId: ID!) {
        portal(userId: $userId) {
          url
        }
      }
    `
  )

  const onUserButtonClick = async () => {
    try {
      const {
        data: {
          portal: { url },
        },
      } = await portal({
        variables: { userId: currentUser.id },
      })

      // Redirect user to Stripe customer portal
      window.location.assign(url)
    } catch (e) {
      toast.error("Couldn't create a session at this time")
    }
  }

  if (!isAuthenticated) {
    return (
      <Button variant="link" to={routes.login()} {...props}>
        Log in
      </Button>
    )
  }

  return (
    <>
      {/* <Button
        aria-label="Start billing portal session"
        variant="icon"
        onClick={onUserButtonClick}
        {...props}
      >
        <User style={{ color: 'var(--primary)' }} />
      </Button> */}
      <Tooltip title="Manage Subscription">
        <Subscriptions
          className="cursor-pointer"
          onClick={onUserButtonClick}
          fontSize="medium"
        />
      </Tooltip>
    </>
  )
}

export default BillingPortal
