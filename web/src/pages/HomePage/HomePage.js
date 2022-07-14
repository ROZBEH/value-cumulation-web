import { TailSpin } from 'react-loader-spinner'
import { UserAddedMetric } from 'src/components/UserAddedMetric'
import { Mapping } from 'src/components/Buttons/Buttons'
import { Mainsubmission } from 'src/components/Mainsubmission/Mainsubmission'
import './HomePage.css'
import { useRecoilValue, useRecoilState } from 'recoil'
import { PlotFundamentals } from 'src/components/PlotFundamentals/PlotFundamentals'
import { useLazyQuery } from '@apollo/react-hooks'
import {
  calledCompanies as calledCompaniesAtom,
  plottingData as plottingDataAtom,
  loadingFinancials as loadingFinancialsAtom,
  metrics as metricsAtom,
  companyList as companyListAtom,
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

const HomePage = () => {
  const [getArticles, { _loading, _error, _data }] = useLazyQuery(QUERY)
  const calledCompanies = useRecoilValue(calledCompaniesAtom)
  const plottingData = useRecoilValue(plottingDataAtom)
  const [_companyList, setCompanyList] = useRecoilState(companyListAtom)
  const metrics = useRecoilValue(metricsAtom)
  const loadingFinancials = useRecoilValue(loadingFinancialsAtom)

  const styleSpin = {
    margin: 'auto',
    position: 'relative',
    // left: '50%',
    justifyContent: 'center',
    alignItems: 'center',
  }
  const paragStyle = {
    position: 'relative',
    // left: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
  }

  // Get the list of available companies on startup
  useEffect(() => {
    getArticles().then((jsonRes) => {
      setCompanyList(jsonRes.data.searchbar)
    })
  }, [getArticles, setCompanyList])

  return (
    <>
      <Mainsubmission />
      <UserAddedMetric />
      <Mapping />
      {loadingFinancials && (
        <div style={styleSpin}>
          <p style={paragStyle}>
            Fetching Data for {calledCompanies[calledCompanies.length - 1].name}
          </p>
          <div>
            <TailSpin color="#87CEEB" height="30" width="30" />
          </div>
        </div>
      )}
      {/* Plot specific metric only when that metric is picked and 
      there is plot data for companies */}
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
