import { TailSpin } from 'react-loader-spinner'
import { UserAddedMetric } from 'src/components/UserAddedMetric'
import { Mapping } from 'src/components/Buttons/Buttons'
import { Mainsubmission } from 'src/components/Mainsubmission/Mainsubmission'
import './HomePage.css'
import { useRecoilValue, useRecoilState } from 'recoil'
import { PlotFundamentals } from 'src/components/PlotFundamentals/PlotFundamentals'
import { useLazyQuery } from '@apollo/react-hooks'
import {
  plottingData as plottingDataA,
  loadingFinancials as loadingFinancialsA,
  metrics as metricsA,
  ticker as tickerA,
  name as nameA,
  companyList as companyListA,
} from 'src/recoil/atoms'
import { useEffect } from 'react'

export const QUERY = gql`
  query SearchBarQuery {
    searchbar {
      symbol
      name
      price
      exchange
      exchangeShortName
      type
    }
  }
`

const onStart = async (getArticles) => {
  const jsonRes = await getArticles()
  return jsonRes
}

const HomePage = () => {
  const [getArticles, { _loading, _error, _data }] = useLazyQuery(QUERY)
  const plottingData = useRecoilValue(plottingDataA)
  const name = useRecoilValue(nameA)
  const [_companyList, setCompanyList] = useRecoilState(companyListA)
  const metrics = useRecoilValue(metricsA)
  const ticker = useRecoilValue(tickerA)
  const loadingFinancials = useRecoilValue(loadingFinancialsA)

  const styleSpin = {
    position: 'relative',
    left: '50%',
    justifyContent: 'center',
    alignItems: 'center',
  }

  // Get the list of available companies on startup
  useEffect(() => {
    onStart(getArticles).then((jsonRes) => {
      setCompanyList(jsonRes.data.searchbar)
    })
  }, [getArticles, setCompanyList])

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
      {metrics &&
        Object.keys(plottingData).length != 0 &&
        metrics.map((item, index) => (
          <PlotFundamentals
            key={index}
            metric={metrics[metrics.length - 1 - index]}
          />
        ))}
    </>
  )
}

export default HomePage
