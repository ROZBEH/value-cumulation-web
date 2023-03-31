import { useEffect, useState } from 'react'

import { useQuery } from '@apollo/client'
import { useRecoilState, useRecoilValue } from 'recoil'

import { popCompany, postProcess } from 'src/commons/processCompany'
import {
  plottingData as plottingDataAtom,
  secReports as secReportsAtom,
} from 'src/recoil/atoms'

export const QUERY = gql`
  query StartUpFundamentalsQuery($tickers: [String!]!) {
    groupFundamentals: getFundamentalsGroup(tickers: $tickers) {
      companyName
      metricNames
      fullMetricNames
      metricValues
      metricsDescription
      secReports {
        symbol
        fillingDate
        acceptedDate
        cik
        type
        link
        finalLink
      }
      years
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Empty</div>

export const Failure = ({ error }) => (
  <div style={{ color: 'red' }}>Error: {error?.message}</div>
)

export const Success = ({ groupFundamentals }) => {
  // const [processedData, setProcessedData] = useState([])
  const [pltData, setPltData] = useRecoilState(plottingDataAtom)
  const [secReport, setSECReports] = useRecoilState(secReportsAtom)
  console.log('secReport = ', secReport)
  console.log('pltData = ', pltData)
  // postProcess(groupFundamentals[0], 0, pltData, setPltData, setSECReports)
  const { loading, error } = useQuery(QUERY, {
    variables: { tickers: ['AAPL', 'MSFT'] },
    onCompleted: (data) => {
      // if it already has data, then don't do anything
      console.log('data.groupFundamentals = ', data.groupFundamentals)
      if (Object.keys(pltData).length > 0) {
        return
      }
      for (var i = 0; i < data.groupFundamentals.length; i++) {
        console.log('i = ', i)
        console.log('data.groupFundamentals[i] = ', data.groupFundamentals[i])
        postProcess(
          data.groupFundamentals[i],
          i,
          pltData,
          setPltData,
          setSECReports
        )
      }
      // const processedGroupFundamentals = data.groupFundamentals.map(
      //   (fundamentals, index) =>
      //     postProcess(fundamentals, index, pltData, setPltData, setSECReports)
      // )
      // setProcessedData(processedGroupFundamentals)
    },
  })
  if (loading) return <Loading />
  if (error) return <Failure error={error} />
  return null
}
