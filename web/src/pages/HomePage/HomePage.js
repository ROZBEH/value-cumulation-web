import { useState } from 'react'
import { Mapping } from 'src/components/Buttons/Buttons'
import { Mainsubmission } from 'src/components/Mainsubmission/Mainsubmission'
import './HomePage.css'
import FundamentalanalysisCell from 'src/components/FundamentalanalysisCell'
const HomePage = () => {
  const [ticker, setTicker] = useState()
  const pickTicker = (data) => {
    setTicker(data.ticker)
  }
  const [metrics, setMetrics] = useState()
  const onSelect = (data) => {
    setMetrics(data)
  }

  return (
    <>
      <Mapping metrics={onSelect} />
      <Mainsubmission pickTicker={pickTicker} />
      {ticker && metrics && (
        <FundamentalanalysisCell ticker={ticker} metrics={metrics} />
      )}
    </>
  )
}

export default HomePage
