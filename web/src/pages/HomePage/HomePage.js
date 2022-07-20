import { TailSpin } from 'react-loader-spinner'
import { useAuth } from '@redwoodjs/auth'
import { UserAddedMetric } from 'src/components/UserAddedMetric'
import { Mapping } from 'src/components/Buttons/Buttons'
import { Mainsubmission } from 'src/components/Mainsubmission/Mainsubmission'
import { Content } from 'src/components/Content/Content'
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
import { Link, Private, routes } from '@redwoodjs/router'
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
  const { isAuthenticated, _currentUser, _logOut } = useAuth()
  const [getArticles, { _loading, _error, _data }] = useLazyQuery(QUERY)
  const calledCompanies = useRecoilValue(calledCompaniesAtom)
  const plottingData = useRecoilValue(plottingDataAtom)
  const [_companyList, setCompanyList] = useRecoilState(companyListAtom)
  const metrics = useRecoilValue(metricsAtom)
  const loadingFinancials = useRecoilValue(loadingFinancialsAtom)

  // Get the list of available companies on startup
  useEffect(() => {
    if (isAuthenticated) {
      getArticles().then((jsonRes) => {
        setCompanyList(jsonRes.data.searchbar)
      })
    }
  }, [getArticles, setCompanyList, isAuthenticated])
  if (!isAuthenticated) {
    return (
      <div>
        You are not logged in. Please <Link to={routes.login()}>Login</Link>
      </div>
    )
  }

  return (
    <>
      <Content />
      <Mainsubmission />
      <UserAddedMetric />
      <Mapping />
      {loadingFinancials && (
        <div className="loader">
          <div className="loader-content">
            <TailSpin
              color="#15518e"
              height="40"
              width="40"
              className="tail-spinner"
            />
            <div className="loader-message">
              {' '}
              Fetching Data for{' '}
              {calledCompanies[calledCompanies.length - 1].name}
            </div>
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
