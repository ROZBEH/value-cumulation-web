import { TailSpin } from 'react-loader-spinner'
import { useAuth } from '@redwoodjs/auth'
import { UserAddedMetric } from 'src/components/UserAddedMetric'
import { Mainsubmission } from 'src/components/Mainsubmission/Mainsubmission'
import { Content } from 'src/components/Content/Content'
import './Financials.css'
import { useRecoilValue, useRecoilState } from 'recoil'
import { PlotFundamentals } from 'src/components/PlotFundamentals/PlotFundamentals'
import { useLazyQuery } from '@apollo/react-hooks'
import {
  userFavMetrics as userFavMetricsAtom,
  calledCompanies as calledCompaniesAtom,
  plottingData as plottingDataAtom,
  loadingFinancials as loadingFinancialsAtom,
  metrics as metricsAtom,
  companyList as companyListAtom,
} from 'src/recoil/atoms'
import { useEffect } from 'react'
import { STARTUP_QUERY } from 'src/commons/gql'

export const Financials = () => {
  const { isAuthenticated, currentUser, _logOut } = useAuth()
  const [getArticles, { _loading, _error, _data }] = useLazyQuery(STARTUP_QUERY)
  const calledCompanies = useRecoilValue(calledCompaniesAtom)
  const plottingData = useRecoilValue(plottingDataAtom)
  const [_companyList, setCompanyList] = useRecoilState(companyListAtom)
  const [metrics, _setMetrics] = useRecoilState(metricsAtom)
  const loadingFinancials = useRecoilValue(loadingFinancialsAtom)
  const [_, setUserFavMetrics] = useRecoilState(userFavMetricsAtom)

  // Get the list of available companies on startup
  useEffect(() => {
    if (isAuthenticated) {
      getArticles({
        variables: { id: currentUser.id },
      }).then((jsonRes) => {
        setCompanyList(jsonRes.data.searchbar)
        var favMetrics = jsonRes.data.user.favorites.map(function (fav) {
          return fav.name
        })
        setUserFavMetrics(favMetrics)
      })
    }
  }, [
    getArticles,
    setCompanyList,
    isAuthenticated,
    currentUser,
    setUserFavMetrics,
  ])
  if (!isAuthenticated) {
    return (
      <div className="mx-96">
        <Content />
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-rows-3 grid-cols-2">
        <div className="col-span-1 flex grid  mx-2">
          <Mainsubmission />
        </div>
        <div className="col-span-1 row-span-3">
          <Content />
        </div>
        <div className="row-span-1 col-span-1 flex items-center mx-2">
          <UserAddedMetric />
        </div>
        {/* <div className="row-span-1 col-span-1 mx-3">
          <Mapping />
        </div> */}
      </div>
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