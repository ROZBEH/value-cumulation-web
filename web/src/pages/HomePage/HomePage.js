import { useAuth } from '@redwoodjs/auth'
import { Tabs, Tab, Box } from '@mui/material'
import * as React from 'react'
import { Financials } from 'src/components/Financials/Financials'
import PropTypes from 'prop-types'
import Typography from '@mui/material/Typography'

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
          <Typography component={'span'}>{children}</Typography>
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

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  }
}

const HomePage = () => {
  const [value, setValue] = React.useState(0)
  const { isAuthenticated, currentUser, _logOut } = useAuth()

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  return (
    <Box sx={{ width: '100%', marginLeft: '5px' }}>
      <Box
        sx={{
          borderBottom: 1,
          borderColor: 'divider',
          borderBlockEnd: 'inherit',
        }}
      >
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab label="Financials" {...a11yProps(0)} />
          <Tab label="Item Two" {...a11yProps(1)} />
          <Tab label="Item Three" {...a11yProps(2)} />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <Financials />
      </TabPanel>
      <TabPanel value={value} index={1}>
        Item Two
      </TabPanel>
      <TabPanel value={value} index={2}>
        Item three
      </TabPanel>
    </Box>
  )
}

export default HomePage
