/**
Value Cumulation
Copyright (c) 2022 Value Cumulation

Notice: All code and information in this repository is the property of Value Cumulation.
You are strictly prohibited from distributing or using this repository unless otherwise stated.
 */
import * as React from 'react'

import { useLazyQuery } from '@apollo/client'
import { TailSpin } from 'react-loader-spinner'
import { useRecoilValue, useRecoilState, useResetRecoilState } from 'recoil'

import { COMPANY_QUERY } from 'src/commons/gql'
import { preparePlotData } from 'src/commons/processCompany'
import { PlotFundamentals } from 'src/components/PlotFundamentals/PlotFundamentals'
import { SectorRadioButton } from 'src/components/SectorRadioButton/SectorRadioButton'
import {
  sectorCompData as sectorCompDataAtom,
  metrics as metricsAtom,
  sectorComp as sectorCompAtom,
} from 'src/recoil/atoms'
import { sectorCompanies as sectorCompaniesAtom } from 'src/recoil/sectorAtom'
export const Sector = () => {
  // define a react state variable called 'count' with an initial value of 0
  const [loading, setLoading] = React.useState(false)
  const [sectorCompData, setSectorCompData] = useRecoilState(sectorCompDataAtom)
  const resetSectorCompData = useResetRecoilState(sectorCompDataAtom)
  const [getFunamentals] = useLazyQuery(COMPANY_QUERY)
  const metrics = useRecoilValue(metricsAtom)
  const sectorCompanies = useRecoilValue(sectorCompaniesAtom)
  const [sectorComp, _setSectorComp] = useRecoilState(sectorCompAtom)

  const onClickSectorComp = async () => {
    resetSectorCompData()
    let plotData = {}
    const thisSector = sectorCompanies[sectorComp]
    if (thisSector.length > 0) {
      for (var i = 0; i < thisSector.length; i++) {
        setLoading(true)
        await getFunamentals({
          variables: { ticker: thisSector[i].symbol },
        }).then((fundamentalanalysis) => {
          plotData = JSON.parse(JSON.stringify(plotData))
          plotData = preparePlotData(
            fundamentalanalysis.data.getFundamentals,
            plotData,
            i
          )
        })
      }
    }
    // Now add the company of interest to the plotData
    await getFunamentals({
      variables: { ticker: sectorComp },
      fetchPolicy: 'no-cache',
    }).then((fundamentalanalysis) => {
      plotData = JSON.parse(JSON.stringify(plotData))
      plotData = preparePlotData(
        fundamentalanalysis.data.getFundamentals,
        plotData,
        thisSector.length,
        4 // strokeWidth
      )
    })
    setLoading(false)
    setSectorCompData(plotData)
  }

  return (
    <div>
      {Object.keys(sectorCompanies).length > 0 ? (
        <div>
          <div className="sectorComp flex flex-col items-center justify-center mb-20">
            <div className="mb-10">
              Our Artificial Intelligence Engine allows us to compare the
              performance of your company of interest to that of other companies
              in the same industry, providing valuable insights.
            </div>
            <div>
              Pick the Company in the list below and click submit to see the
            </div>
            <div className="mt-4 z-0">
              <SectorRadioButton />
            </div>
            <button
              className="rounded-lg w-20 h-8 bg-lightsky-blue border border-gray-300 text-white cursor-pointer ml-1 mt-4"
              onClick={onClickSectorComp}
            >
              Submit
            </button>
            {loading && (
              <div className="loader">
                <div className="loader-content">
                  <TailSpin
                    color="#15518e"
                    height="40"
                    width="40"
                    className="tail-spinner"
                  />
                  <div className="loader-message">
                    <p>Fetching and displaying results</p>
                    <p>Our Search Engine is Running Behind the Scenes.</p>
                    <p>We will be back shortly</p>
                  </div>
                </div>
              </div>
            )}
          </div>
          {!loading &&
            metrics &&
            Object.keys(sectorCompData).length != 0 &&
            metrics.map((item, index) => (
              <PlotFundamentals
                key={index}
                metric={metrics[metrics.length - 1 - index]}
                plottingData={sectorCompData}
              />
            ))}
        </div>
      ) : (
        <div>Please first pick a company on the FINANCIALS tab</div>
      )}
    </div>
  )
}
