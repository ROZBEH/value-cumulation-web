import {
  LineChart,
  Legend,
  Line,
  YAxis,
  CartesianGrid,
  Tooltip,
  XAxis,
} from 'recharts'
import { useEffect } from 'react'
import { useRecoilState } from 'recoil'
import { name, loadingFinancials } from 'src/recoil/atoms'
export const QUERY = gql`
  query GetFundamentalQuery($ticker: [String!]!, $metric: String!) {
    fundamentalanalysis: getSingleMetric(ticker: $ticker, metric: $metric) {
      company_name
      metric_name
      metric_value
      years
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
  const [, setLoadingFinancials] = useRecoilState(loadingFinancials)
  const [, setName] = useRecoilState(name)
  const nameCompany = fundamentalanalysis.company_name
  const result = fundamentalanalysis.metric_value
  const metricName = fundamentalanalysis.metric_name
  const years = fundamentalanalysis.years
  // Brining the data into the correct format for the rechart
  var plotData = []
  for (var i = 0; i < result[0].length; i++) {
    plotData.push({})
  }
  for (let i = 0; i < nameCompany.length; i++) {
    for (let j = 0; j < result[i].length; j++) {
      plotData[j][nameCompany[i]] = result[i][j]
      if (i === 0) {
        plotData[j]['name'] = years[j]
      }
    }
  }

  const stroke = ['#87CEEB', '#FFA500']
  const chartStyle = {
    position: 'relative',
    left: '10%',
    justifyContent: 'center',
    alignItems: 'center',
    display: 'inline-block',
    fontSize: '0.9rem',
  }

  useEffect(() => {
    setLoadingFinancials(false)
    setName(nameCompany)
  }, [setName, nameCompany, setLoadingFinancials])

  return (
    <div style={{ display: 'inline-block' }}>
      <section>
        <LineChart
          intractive={true}
          data={plotData}
          align="right"
          width={600}
          height={250}
          margin={{ top: 20, right: 10, left: 20, bottom: 20 }}
          style={chartStyle}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <YAxis
            style={{
              fontSize: '0.9rem',
            }}
            label={
              <text x={200} y={0} dx={50} dy={15} offset={0} angle={-90}>
                {fundamentalanalysis.metric_name[0]}
              </text>
            }
          />
          <XAxis
            style={{
              fontSize: '0.9rem',
            }}
            interval={0}
            dataKey="name"
          />
          <Legend />
          {nameCompany.map((name, index) => (
            <Line
              key={index}
              isAnimationActive={false}
              type="monotone"
              dataKey={name}
              stroke={stroke[index]}
            />
          ))}
          <Tooltip />
        </LineChart>
      </section>
    </div>
  )
}
