import { useState } from 'react'
import { Mapping } from 'src/components/Buttons/Buttons'
import { Mainsubmission } from 'src/components/Mainsubmission/Mainsubmission'
import './HomePage.css'
import FundamentalanalysisCell from 'src/components/FundamentalanalysisCell'
import { useEffect } from 'react'

const HomePage = () => {
  const [ticker, setTicker] = useState()
  const [name, setName] = useState()
  const pickTicker = (data) => {
    setTicker(data.ticker)
  }
  const [metrics, setMetrics] = useState()
  const onSelect = (data) => {
    if (metrics !== data) {
      setMetrics(data)
    }
  }
  const updateName = (data) => {
    setName(data)
  }

  useEffect(() => {
    updateName('')
  }, [ticker])

  return (
    <>
      <Mapping parentToChild={ticker} metrics={onSelect} />
      <Mainsubmission pickTicker={pickTicker} />
      {!name && ticker && <h2>Fetching Data for symbol {ticker} ...</h2>}
      {name && <h1>{name}</h1>}
      {metrics &&
        ticker &&
        metrics.map((item, index) => (
          <FundamentalanalysisCell
            key={index}
            ticker={ticker}
            updateName={updateName}
            metric={metrics[metrics.length - 1 - index]}
          />
        ))}
    </>
  )
}

export default HomePage
