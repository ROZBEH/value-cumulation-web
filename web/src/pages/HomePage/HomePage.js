/**
Value Cumulation
Copyright (c) 2022 Value Cumulation

Notice: All code and information in this repository is the property of Value Cumulation.
You are strictly prohibited from distributing or using this repository unless otherwise stated.
 */
import * as React from 'react'
import { useEffect } from 'react'

import { useLazyQuery } from '@apollo/client'
import { Tabs, Tab, Box } from '@mui/material'
import Typography from '@mui/material/Typography'
import PropTypes from 'prop-types'

import { useAuth } from 'src/auth'
import { SUBS_HISTORY } from 'src/commons/gql'
import { Companyfinder } from 'src/components/Companyfinder/Companyfinder'
import { Financials } from 'src/components/Financials/Financials'
import { Finchat } from 'src/components/Finchat/Finchat'
import { SECLinks } from 'src/components/SECLinks/SECLinks'
import { Sector } from 'src/components/Sector/Sector'
import SubscriptionCell from 'src/components/SubscriptionCell'
import { TabSignup } from 'src/pages/HomePage/TabSignup'

function TabPanel(props) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography component={'div'}>{children}</Typography>
        </Box>
      )}
    </div>
  )
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
}

const HomePage = () => {
  const { isAuthenticated, currentUser, _logOut } = useAuth()
  const [value, setValue] = React.useState(0)
  // set the react state for the subscription history
  const [subscriptionHistory, setSubscriptionHistory] = React.useState({})
  const [subsHistory] = useLazyQuery(SUBS_HISTORY, {
    onCompleted: (data) => {
      setSubscriptionHistory(data.subscriptionHistory)
    },
  })

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  const renderPanel = (isAuthenticated, subscriptionHistory, panelType) => {
    if (
      isAuthenticated &&
      subscriptionHistory &&
      subscriptionHistory.hadSubscription &&
      ['active', 'trialing'].includes(subscriptionHistory.status)
    ) {
      return panelType == 'companyFinder' ? <Companyfinder /> : <Sector />
    } else if (isAuthenticated && subscriptionHistory) {
      return (
        <div>
          <div className="mb-4">
            To enjoy all the amazing features of our product, you can start a
            free trial or renew your subscription today.
          </div>
          <SubscriptionCell userId={currentUser.id} />
        </div>
      )
    } else if (!isAuthenticated) {
      return <TabSignup />
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      subsHistory({ variables: { userId: currentUser.id } })
    }
  }, [isAuthenticated, subsHistory, currentUser])

  return (
    <Box sx={{ width: '100%' }}>
      <Box
        sx={{
          position: 'sticky',
          top: '80px', // corresponds to h-20 in the main layout
          width: '100%',
          borderBottom: 1,
          borderColor: 'divider',
          zIndex: 1000, // set a high z-index
          backgroundColor: '#fff', // set a background color
        }}
      >
        <div style={{ position: 'fixed', zIndex: '-1' }}> </div>
        <Tabs
          variant="scrollable"
          scrollButtons="auto"
          value={value}
          onChange={handleChange}
        >
          <Tab label="Financials" />
          <Tab label="FinChat(AI Powered)" />
          <Tab label="SEC Reports" />
          <Tab
            // style={{ minWidth: '2%' }}
            // variant="fullWidth"
            label="Sector Comparison(AI Powered)"
            // wrapped
          />
          <Tab label="Company Finder" />
        </Tabs>
      </Box>

      <TabPanel value={value} index={0}>
        <Financials />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Finchat />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <SECLinks />
      </TabPanel>
      <TabPanel value={value} index={3}>
        {/* {renderPanel(isAuthenticated, subscriptionHistory, 'sector')} */}
        <Sector />
      </TabPanel>
      <TabPanel value={value} index={4}>
        {renderPanel(isAuthenticated, subscriptionHistory, 'companyFinder')}
      </TabPanel>
    </Box>
  )
}

export default HomePage
