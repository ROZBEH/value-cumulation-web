/**
Value Cumulation
Copyright (c) 2022 Value Cumulation

Notice: All code and information in this repository is the property of Value Cumulation.
You are strictly prohibited from distributing or using this repository unless otherwise stated.
 */
import * as React from 'react'

import { Tabs, Tab, Box } from '@mui/material'
import Typography from '@mui/material/Typography'
import PropTypes from 'prop-types'

// import { useAuth } from '@redwoodjs/auth'

import { Companyfinder } from 'src/components/Companyfinder/Companyfinder'
import { Financials } from 'src/components/Financials/Financials'
// import ProductsCell from 'src/components/ProductsCell'
import { SECLinks } from 'src/components/SECLinks/SECLinks'
import { Sector } from 'src/components/Sector/Sector'

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
  const [value, setValue] = React.useState(0)
  // const { isAuthenticated, currentUser, _logOut } = useAuth()

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Box
        sx={{
          width: '50%',
          borderBottom: 1,
          borderColor: 'divider',
          marginLeft: '30px',
          marginRight: '20px',
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
          <Tab label="SEC Reports" />
          <Tab label="Sector Comparison" />
          <Tab label="Company Finder" />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <Financials />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <SECLinks />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <Sector />
      </TabPanel>
      <TabPanel value={value} index={3}>
        <Companyfinder />
      </TabPanel>

      {/* <ProductsCell type={'recurring'} /> */}
    </Box>
  )
}

export default HomePage
