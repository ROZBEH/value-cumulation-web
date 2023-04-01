import { useQuery } from '@apollo/client'
import { TailSpin } from 'react-loader-spinner'
import { useRecoilState, useRecoilValue } from 'recoil'

import { postProcess } from 'src/commons/processCompany'
import {
  plottingData as plottingDataAtom,
  secReports as secReportsAtom,
  companyList as companyListAtom,
} from 'src/recoil/atoms'
import { sectorCompanies as sectorCompaniesAtom } from 'src/recoil/sectorAtom'

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
    gptIntelligenceGroup(query: $tickers) {
      query
      response {
        symbol
        name
        price
        exchange
        exchangeShortName
        type
      }
    }
  }
`

export const Loading = () => (
  <div className="loader-content">
    <TailSpin color="#15518e" height="40" width="40" className="tail-spinner" />{' '}
  </div>
)

export const Empty = () => <div>Empty</div>

export const Failure = ({ error }) => (
  <div style={{ color: 'red' }}>Error: {error?.message}</div>
)

export const Success = ({ _groupFundamentals }) => {
  const [pltData, setPltData] = useRecoilState(plottingDataAtom)
  const [_secReport, setSECReports] = useRecoilState(secReportsAtom)
  const companyList = useRecoilValue(companyListAtom)
  const [sectorCompanies, setSectorCompanies] =
    useRecoilState(sectorCompaniesAtom)
  const { loading, error } = useQuery(QUERY, {
    variables: { tickers: ['AAPL', 'MSFT'] },
    onCompleted: (data) => {
      // if it already has data, then don't do anything
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
      // Now set the list of sector companies
      const query = data.gptIntelligenceGroup.query

      query.forEach((subQuery, index) => {
        setSectorCompanies((currentState) => {
          return {
            ...currentState,
            [subQuery]: data.gptIntelligenceGroup.response[index],
          }
        })
      })
    },
  })
  if (loading) return <Loading />
  if (error) return <Failure error={error} />
  return null
}
