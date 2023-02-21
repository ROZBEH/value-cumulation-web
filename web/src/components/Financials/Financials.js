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

import { useAuth } from '@redwoodjs/auth'
import { Link, routes } from '@redwoodjs/router'

import { STARTUP_QUERY } from 'src/commons/gql'
import { Content } from 'src/components/Content/Content'
import { Mainsubmission } from 'src/components/Mainsubmission/Mainsubmission'
import { PlotFundamentals } from 'src/components/PlotFundamentals/PlotFundamentals'
import { UserAddedMetric } from 'src/components/UserAddedMetric'
import 'src/components/Financials/Financials.css'
import {
  userFavMetrics as userFavMetricsAtom,
  calledCompanies as calledCompaniesAtom,
  plottingData as plottingDataAtom,
  loadingFinancials as loadingFinancialsAtom,
  metrics as metricsAtom,
  companyList as companyListAtom,
} from 'src/recoil/atoms'

export const Financials = () => {
  const { isAuthenticated, currentUser, _logOut } = useAuth()
  const [_, setUserFavMetrics] = useRecoilState(userFavMetricsAtom)

  const [getCompanies, { _loading, _error, _data }] = useLazyQuery(
    STARTUP_QUERY,
    {
      onCompleted: (data) => {
        setCompanyList(data.companyslist)
        var favMetrics = data.user.favorites.map(function (fav) {
          return fav.name
        })
        setUserFavMetrics(favMetrics)
      },
    }
  )

  // const { _loading, _error, data } = useQuery(STARTUP_QUERY, {
  //   variables: { id: currentUser.id },
  // })
  const calledCompanies = useRecoilValue(calledCompaniesAtom)
  const plottingData = useRecoilValue(plottingDataAtom)
  const [_companyList, setCompanyList] = useRecoilState(companyListAtom)
  const [metrics, _setMetrics] = useRecoilState(metricsAtom)
  const loadingFinancials = useRecoilValue(loadingFinancialsAtom)

  // Get the list of available companies on startup
  useEffect(() => {
    if (isAuthenticated) {
      getCompanies({
        variables: { id: currentUser.id },
      })
    }
  }, [getCompanies, isAuthenticated, currentUser])
  if (!isAuthenticated) {
    return (
      <div className="mx-96">
        <Content />
        <div className="flex flex-col mx-40 my-10">
          <button
            type="button"
            className="text-gray-900 w-48 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-md px-3 py-2 mr-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
          >
            <Link to={routes.signup()}>Let's Begin Here</Link>
          </button>
        </div>
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
            plottingData={plottingData}
          />
        ))}
    </>
  )
}
