import {
  LineChart,
  Legend,
  Line,
  YAxis,
  CartesianGrid,
  Tooltip,
  XAxis,
} from 'recharts'

import { useRecoilValue } from 'recoil'
import { plottingData as plottingDataA } from 'src/recoil/atoms'
export const PlotFundamentals = (metric) => {
  const plottingData = useRecoilValue(plottingDataA)
  const plotData = plottingData[metric.metric]
  const stroke = ['#87CEEB', '#FFA500']
  const chartStyle = {
    position: 'relative',
    left: '10%',
    justifyContent: 'center',
    alignItems: 'center',
    display: 'inline-block',
    fontSize: '0.9rem',
  }

  return (
    <div style={{ display: 'inline-block' }}>
      <section>
        <LineChart
          intractive={true}
          data={plotData.data}
          align="right"
          width={600}
          height={250}
          margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
          style={chartStyle}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <YAxis
            style={{
              fontSize: '0.9rem',
            }}
            label={
              <text x={200} y={0} dx={50} dy={15} offset={0} angle={-90}>
                {plotData.metricName}
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
          {plotData.nameCompany.map((name, index) => (
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
