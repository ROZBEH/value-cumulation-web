/**
Value Cumulation
Copyright (c) 2022 Value Cumulation

Notice: All code and information in this repository is the property of Value Cumulation.
You are strictly prohibited from distributing or using this repository unless otherwise stated.
 */

import { useEffect } from 'react'

import { useLazyQuery } from '@apollo/client'
import { useRecoilValue, useRecoilState } from 'recoil'

import { COMPANY_QUERY } from 'src/commons/gql'
import { postProcess } from 'src/commons/processCompany'
import { PlotFundamentals } from 'src/components/PlotFundamentals/PlotFundamentals'
import {
  sectorCompData as sectorCompDataAtom,
  metrics as metricsAtom,
} from 'src/recoil/atoms'
import { sectorCompanies as sectorCompaniesAtom } from 'src/recoil/sectorAtom'
export const Sector = () => {
  const [sectorCompData, setSectorCompData] = useRecoilState(sectorCompDataAtom)
  const [getFunamentals, { _called, _loading, _data }] =
    useLazyQuery(COMPANY_QUERY)
  const metrics = useRecoilValue(metricsAtom)
  const sectorCompanies = useRecoilValue(sectorCompaniesAtom)

  const onClickSectorComp = async () => {
    let plotData = {}
    if (sectorCompanies.length > 0) {
      for (var i = 0; i < sectorCompanies.length; i++) {
        await getFunamentals({
          variables: { ticker: sectorCompanies[i].symbol },
        }).then((fundamentalanalysis) => {
          plotData = JSON.parse(JSON.stringify(plotData))
          plotData = postProcess(
            fundamentalanalysis.data.getFundamentals,
            plotData
          )
        })
      }
    }
    setSectorCompData(plotData)
  }

  return (
    <div>
      <button onClick={onClickSectorComp}>Plot Sector</button>
      {sectorCompanies.length > 0 ? (
        metrics &&
        Object.keys(sectorCompData).length != 0 &&
        metrics.map((item, index) => (
          <PlotFundamentals
            key={index}
            metric={metrics[metrics.length - 1 - index]}
            plottingData={sectorCompData}
          />
        ))
      ) : (
        <div>Please first pick a company on the FINANCIALS tab</div>
      )}
    </div>
  )
}
