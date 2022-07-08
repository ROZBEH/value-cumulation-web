import { TailSpin } from 'react-loader-spinner'
import { useLazyQuery } from '@apollo/react-hooks'
import { UserAddedMetric } from 'src/components/UserAddedMetric'
import { Mapping } from 'src/components/Buttons/Buttons'
import { Mainsubmission } from 'src/components/Mainsubmission/Mainsubmission'
import './HomePage.css'
import FundamentalanalysisCell from 'src/components/FundamentalanalysisCell'
import { useRecoilValue } from 'recoil'
import { PlotFundamentals } from 'src/components/PlotFundamentals/PlotFundamentals'
import {
  plottingData as plottingDataA,
  loadingFinancials as loadingFinancialsA,
  metrics as metricsA,
  ticker as tickerA,
  name as nameA,
} from 'src/recoil/atoms'

import { useEffect } from 'react'

export const QUERY = gql`
  query GetFundamentalQuery($ticker: [String!]!, $metric: String!) {
    fundamentalanalysis: getSingleMetric(ticker: $ticker, metric: $metric) {
      company_name
      metric_name
      metric_value
      years
    }
  }
`
const HomePage = () => {
  const plottingData = useRecoilValue(plottingDataA)
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
      <Mainsubmission />
      {!name && ticker.length != 0 && (
        <h2>Fetching Data for symbol {ticker} ...</h2>
      )}
      <UserAddedMetric />
      <Mapping />
      {name && <h2>{name}</h2>}
      {loadingFinancials && (
        <div style={styleSpin}>
          <TailSpin color="#87CEEB" height="50" width="50" />
        </div>
      )}
      {/* {metrics &&
        ticker.length != 0 &&
        metrics.map((item, index) => (
          <FundamentalanalysisCell
            key={index}
            ticker={ticker}
            metric={metrics[metrics.length - 1 - index]}
          />
        ))} */}

      {console.log(
        'Object.keys(plottingData).length = ',
        Object.keys(plottingData).length
      )}
      {metrics &&
        Object.keys(plottingData).length != 0 &&
        metrics.map((item, index) => (
          <PlotFundamentals key={index} metric={item} />
        ))}
    </>
  )
}

export default HomePage
