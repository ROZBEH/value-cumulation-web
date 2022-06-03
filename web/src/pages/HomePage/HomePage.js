import { TailSpin } from 'react-loader-spinner'
import { Mapping } from 'src/components/Buttons/Buttons'
import { Mainsubmission } from 'src/components/Mainsubmission/Mainsubmission'
import './HomePage.css'
import FundamentalanalysisCell from 'src/components/FundamentalanalysisCell'
import { useRecoilValue } from 'recoil'
import {
  loadingFinancials as loadingFinancialsA,
  metrics as metricsA,
  ticker as tickerA,
  name as nameA,
} from 'src/recoil/atoms'

const HomePage = () => {
  const name = useRecoilValue(nameA)
  const metrics = useRecoilValue(metricsA)
  const ticker = useRecoilValue(tickerA)
  const loadingFinancials = useRecoilValue(loadingFinancialsA)

  const styleSpin = {
    position: 'relative',
    left: '50%',
    justifyContent: 'center',
    alignItems: 'center',
  }

  return (
    <>
      <Mapping />
      <Mainsubmission />
      {!name && ticker && <h2>Fetching Data for symbol {ticker} ...</h2>}
      {name && <h1>{name}</h1>}
      {loadingFinancials && (
        <div style={styleSpin}>
          <TailSpin color="#87CEEB" height="50" width="50" />
        </div>
      )}
      {metrics &&
        ticker &&
        metrics.map((item, index) => (
          <FundamentalanalysisCell
            key={index}
            ticker={ticker}
            metric={metrics[metrics.length - 1 - index]}
          />
        ))}
    </>
  )
}

export default HomePage
