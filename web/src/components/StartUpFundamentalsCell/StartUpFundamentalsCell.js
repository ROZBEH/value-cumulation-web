import { useQuery } from '@apollo/client'
import { useRecoilState } from 'recoil'

import { postProcess } from 'src/commons/processCompany'
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

export const Success = ({ _groupFundamentals }) => {
  const [pltData, setPltData] = useRecoilState(plottingDataAtom)
  const [_secReport, setSECReports] = useRecoilState(secReportsAtom)
  const { loading, error } = useQuery(QUERY, {
    variables: { tickers: ['AAPL', 'MSFT'] },
    onCompleted: (data) => {
      // if it already has data, then don't do anything
      console.log('data.groupFundamentals = ', data.groupFundamentals)
      if (pltData && Object.keys(pltData).length > 0) {
        return
      }
      let tmpPlot = { ...pltData }
      data.groupFundamentals.forEach(
        (fundamental, i) =>
          (tmpPlot = postProcess(
            fundamental,
            i,
            tmpPlot,
            setPltData,
            setSECReports
          ))
      )
    },
  })
  if (loading) return <Loading />
  if (error) return <Failure error={error} />
  return null
}
