/**
Value Cumulation
Copyright (c) 2022 Value Cumulation

Notice: All code and information in this repository is the property of Value Cumulation.
You are strictly prohibited from distributing or using this repository unless otherwise stated.
 */

import { useEffect } from 'react'

import { useLazyQuery } from '@apollo/react-hooks'
import { TailSpin } from 'react-loader-spinner'
import { useRecoilValue, useRecoilState } from 'recoil'

// import { Link, routes } from '@redwoodjs/router'

import { STARTUP_QUERY } from 'src/commons/gql'
import { Content } from 'src/components/Content/Content'
import { Mainsubmission } from 'src/components/Mainsubmission/Mainsubmission'
import { PlotFundamentals } from 'src/components/PlotFundamentals/PlotFundamentals'
import { StartUpFundamentals } from 'src/components/StartUpFundamentals/StartUpFundamentals'
import { UserAddedMetric } from 'src/components/UserAddedMetric'
import 'src/components/Financials/Financials.css'
import {
  // userFavMetrics as userFavMetricsAtom,
  calledCompanies as calledCompaniesAtom,
  plottingData as plottingDataAtom,
  loadingFinancials as loadingFinancialsAtom,
  metrics as metricsAtom,
  companyList as companyListAtom,
  currentSearchBox as currentSearchBoxAtom,
} from 'src/recoil/atoms'

export const Financials = () => {
  // const { isAuthenticated, currentUser, _logOut } = useAuth()
  // const [_, setUserFavMetrics] = useRecoilState(userFavMetricsAtom)

  const [getCompanies, { _loading, _error, _data }] = useLazyQuery(
    STARTUP_QUERY,
    {
      onCompleted: (data) => {
        setCompanyList(data.companyslist)
        // var favMetrics = data.user.favorites.map(function (fav) {
        //   return fav.name
        // })
        // setUserFavMetrics(favMetrics)
      },
    }
  )

  // const { _loading, _error, data } = useQuery(STARTUP_QUERY, {
  //   variables: { id: currentUser.id },
  // })
  const currentSearchBox = useRecoilValue(currentSearchBoxAtom)
  const calledCompanies = useRecoilValue(calledCompaniesAtom)
  const plottingData = useRecoilValue(plottingDataAtom)
  const [_companyList, setCompanyList] = useRecoilState(companyListAtom)
  const [metrics, _setMetrics] = useRecoilState(metricsAtom)
  const loadingFinancials = useRecoilValue(loadingFinancialsAtom)

  // Get the list of available companies on startup
  useEffect(() => {
    // if (isAuthenticated) {
    //   getCompanies({
    //     variables: { id: currentUser.id },
    //   })
    getCompanies()
    // getCompanies({
    //   variables: { id: currentUser.id },
    // })
  }, [getCompanies])

  return (
    <>
      <div className="flex flex-col">
        <div className="mx-2 my-5">
          <Mainsubmission />
        </div>
        <div className="items-center mx-2 mt-5 mb-10">
          <UserAddedMetric />
        </div>
      </div>
      {/* <div className="grid grid-rows-3 grid-cols-2">
        <div className="col-span-1 flex mx-2">
          <Mainsubmission />
        </div>
        <div className="col-span-1 row-span-3">
          <Content />
        </div>
        <div className="row-span-1 col-span-1 flex items-center mx-2">
          <UserAddedMetric />
        </div>
      </div> */}
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
              Fetching Data for {calledCompanies[currentSearchBox].name}
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
            plottingData={plottingData}
          />
        ))}
      {Object.keys(plottingData).length == 0 && (
        <StartUpFundamentals tickers={['AAPL', 'MSFT']} />
      )}
      <div className="flex justify-center">
        <Content />
      </div>
    </>
  )
}
