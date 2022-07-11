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
import { plottingData as plottingDataAtom } from 'src/recoil/atoms'

export const PlotFundamentals = (props) => {
  const plottingData = useRecoilValue(plottingDataAtom)
  const plotData = plottingData[props.metric]
  // stroke determines the color of each line in the plot
  const stroke = [
    '#87CEEB',
    '#FFA500',
    '#000075',
    '#e6194B',
    '#4363d8',
    '#ffd8b1',
  ]
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
          {/* The following allows multiple lines to be plotted in the same
          LineChart */}
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
