import { useQuery } from '@apollo/client'
import { Skeleton } from '@mui/material'
import { TailSpin } from 'react-loader-spinner'
import { useRecoilState } from 'recoil'

import { postProcess } from 'src/commons/processCompany'
import {
  plottingData as plottingDataAtom,
  secReports as secReportsAtom,
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
  <div>
    <div className="loader-content">
      {/* <TailSpin color="#15518e" height="40" width="40" className="tail-spinner" />{' '} */}
      <Skeleton
        animation="wave"
        variant="rounded"
        width={400}
        height={185}
        className="mr-24"
      />
      <Skeleton
        animation="wave"
        variant="rounded"
        width={400}
        height={185}
        className="ml-24"
      />
    </div>
    <div className="loader-content mt-20">
      <Skeleton
        animation="wave"
        variant="rounded"
        width={400}
        height={185}
        className="mr-24"
      />
      <Skeleton
        animation="wave"
        variant="rounded"
        width={400}
        height={185}
        className="ml-24"
      />
    </div>
  </div>
)

export const Empty = () => <div>Empty</div>

export const Failure = ({ error }) => (
  <div style={{ color: 'red' }}>Error: {error?.message}</div>
)

export const StartUpFundamentals = ({ tickers }) => {
  const [pltData, setPltData] = useRecoilState(plottingDataAtom)
  const [_secReport, setSECReports] = useRecoilState(secReportsAtom)
  const [_sectorCompanies, setSectorCompanies] =
    useRecoilState(sectorCompaniesAtom)

  const { loading, error } = useQuery(QUERY, {
    variables: { tickers: tickers },
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
