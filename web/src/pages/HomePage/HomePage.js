import { Form, TextField, Submit } from '@redwoodjs/forms'
import { useState } from 'react'
// import { MetaTags } from '@redwoodjs/web'
import './HomePage.css'
import FundamentalanalysisCell from 'src/components/FundamentalanalysisCell'
const HomePage = () => {
  const [ticker, setTicker] = useState()
  const onSubmit = (data) => {
    setTicker(data.ticker)
  }
  return (
    <>
      <Form onSubmit={onSubmit} style={{ fontSize: '2rem' }}>
        <TextField
          name="ticker"
          placeholder="Stock Ticker"
          maxLength="10"
          // validation={{ required: true, pattern: /^\d{5}$/ }}
        />
        <Submit>Go</Submit>
      </Form>
      {ticker && <FundamentalanalysisCell ticker={ticker} />}
    </>
  )
}

export default HomePage
