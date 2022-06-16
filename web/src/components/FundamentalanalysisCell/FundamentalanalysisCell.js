import { LineChart, Line, YAxis, CartesianGrid, Tooltip } from 'recharts'
import { useEffect } from 'react'
import { useRecoilState } from 'recoil'
import { name, loadingFinancials } from 'src/recoil/atoms'
export const QUERY = gql`
  query GetFundamentalQuery($ticker: String!, $metric: String!) {
    fundamentalanalysis: getSingleMetric(ticker: $ticker, metric: $metric) {
      company_name
      metric_name
      metric_value
    }
  }
`

export const Loading = () => {
  console.log('in loading')
  // const [loadingVal, setLoadingFinancials] = useRecoilState(loadingFinancials)
  // useEffect(() => {
  //   setLoadingFinancials(true)
  // }, [setLoadingFinancials, loadingVal])
  return true
}

export const Empty = () => <div>Empty</div>

export const Failure = ({ error }) => {
  return <div style={{ color: 'red' }}>Error: {error.message}</div>
}

export const Success = ({ fundamentalanalysis }) => {
  console.log('in success')
  const [, setLoadingFinancials] = useRecoilState(loadingFinancials)
  const [, setName] = useRecoilState(name)
  const nameCompany = fundamentalanalysis.company_name
  const result = fundamentalanalysis.metric_value
  const chartStyle = {
    position: 'relative',
    left: '10%',
    justifyContent: 'center',
    alignItems: 'center',
    display: 'inline-block',
  }

  // useEffect(() => {
  //   setLoadingFinancials(false)
  //   setName(nameCompany)
  // }, [setName, nameCompany, setLoadingFinancials])

  return (
    <div style={{ display: 'inline-block' }}>
      <section>
        <LineChart
          intractive={true}
          align="right"
          width={600}
          height={250}
          data={result}
          margin={{ top: 20, right: 10, left: 20, bottom: 20 }}
          style={chartStyle}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <YAxis
            label={
              <text x={200} y={0} dx={50} dy={15} offset={0} angle={-90}>
                {fundamentalanalysis.metric_name}
              </text>
            }
            dataKey={(v) => v}
          />
          <Tooltip />
          <Line
            isAnimationActive={false}
            type="monotone"
            dataKey={(v) => v}
            stroke="#8884d8"
          />
        </LineChart>
      </section>
    </div>
  )
}
