import { LineChart, Line, YAxis, CartesianGrid, Tooltip } from 'recharts'
import { useEffect } from 'react'
import { TailSpin } from 'react-loader-spinner'
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
  const style = {
    position: 'relative',
    left: '50%',
    justifyContent: 'center',
    alignItems: 'center',
  }
  return (
    <div style={style}>
      <TailSpin color="#87CEEB" height="50" width="50" />
    </div>
  )
}

export const Empty = () => <div>Empty</div>

export const Failure = ({ error }) => {
  console.log(error)
  return <div style={{ color: 'red' }}>Error: {error.message}</div>
}

export const Success = ({ fundamentalanalysis, updateName }) => {
  const result = fundamentalanalysis.metric_value
  const name = fundamentalanalysis.company_name
  const chartStyle = {
    position: 'relative',
    left: '10%',
    justifyContent: 'center',
    alignItems: 'center',
    display: 'inline-block',
  }

  useEffect(() => {
    updateName(name)
  }, [updateName, name])

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
