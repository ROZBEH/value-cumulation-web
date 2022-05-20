import {
  LineChart,
  Line,
  // XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  // Legend,
  // ResponsiveContainer,
} from 'recharts'

// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend,
// } from 'chart.js'
// import { Line } from 'react-chartjs-2'
// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend
// )
export const QUERY = gql`
  query GetFundamentalsQuery($ticker: String!, $metrics: [String!]!) {
    fundamentalanalysis: getFundamental(ticker: $ticker, metrics: $metrics) {
      ticker
      intrinsic_value
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Empty</div>

export const Failure = ({ error }) => (
  <div style={{ color: 'red' }}>Error: {error.message}</div>
)

export const Success = ({ fundamentalanalysis }) => {
  // const options = {
  // height: 20%,
  // width: 50%,
  // responsive: true,
  //   plugins: {
  //     legend: {
  //       position: 'top',
  //     },
  //     title: {
  //       display: true,
  //       text: 'Chart.js Line Chart',
  //     },
  //   },
  // }
  // const labels = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']
  // const data = {
  //   labels,
  //   datasets: [
  //     {
  //       label: 'Dataset 2',
  //       data: fundamentalanalysis.intrinsic_value,
  //       borderColor: 'rgb(255, 99, 132)',
  //       backgroundColor: 'rgba(255, 99, 132, 0.5)',
  //     },
  //   ],
  // }
  return (
    <section>
      <h1>{fundamentalanalysis.ticker}</h1>
      {fundamentalanalysis.intrinsic_value.map((item, index) => (
        <LineChart
          key={index}
          intractive={true}
          align="right"
          width={800}
          height={300}
          data={item}
          margin={{ top: 10, right: 30, left: 100, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <YAxis dataKey={(v) => v} />
          <Tooltip />
          <Line type="monotone" dataKey={(v) => v} stroke="#8884d8" />
        </LineChart>
      ))}

      {/* <Line width={100} height={50} options={options} data={data} /> */}
    </section>
  )
}
