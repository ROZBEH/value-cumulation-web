/**
Value Cumulation
Copyright (c) 2022 Value Cumulation

Notice: All code and information in this repository is the property of Value Cumulation.
You are strictly prohibited from distributing or using this repository unless otherwise stated.
 */
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
  function timeout(delay) {
    return new Promise((res) => setTimeout(res, delay))
  }

  const onUserButtonClick = async () => {
    toast.success('Opening in a new window tab')
    await timeout(2000) //for 1 sec delay
    try {
      const {
        data: {
          portal: { url },
        },
      } = await portal({
        variables: { userId: currentUser.id },
      })

      // Redirect user to Stripe customer portal
      // window.location.assign(url)
      window.open(url, '_blank')
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
    <div className="flex flex-row">
      <div>Modify Subscription</div>
      <div>
        <Tooltip title="Manage Subscription">
          <Subscriptions
            className="cursor-pointer"
            onClick={onUserButtonClick}
            fontSize="medium"
          />
        </Tooltip>
      </div>
    </div>
  )
}

export default BillingPortal
