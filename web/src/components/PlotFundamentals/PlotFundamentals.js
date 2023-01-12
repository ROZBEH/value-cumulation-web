/**
Value Cumulation
Copyright (c) 2022 Value Cumulation

Notice: All code and information in this repository is the property of Value Cumulation.
You are strictly prohibited from distributing or using this repository unless otherwise stated.
 */

import {
  LineChart,
  Legend,
  Line,
  YAxis,
  CartesianGrid,
  Tooltip,
  XAxis,
  Brush,
} from 'recharts'

import { Infopop } from 'src/components/Infopop/Infopop'
import './PlotFundamentals.css'

export const PlotFundamentals = (props) => {
  const plotData = props.plottingData[props.metric]
  // stroke determines the color of each line in the plot
  const stroke = [
    '#87CEEB',
    '#FFA500',
    '#000075',
    '#e6194B',
    '#4363d8',
    '#ffd8b1',
  ]

  const DataFormater = (number) => {
    var absNumber = Math.abs(number)
    if (absNumber > 1000000000) {
      return (number / 1000000000).toString() + ' B'
    } else if (absNumber > 1000000) {
      return (number / 1000000).toString() + ' M'
    } else if (absNumber > 1000) {
      return (number / 1000).toString() + ' K'
    } else {
      return number.toString()
    }
  }

  const CustomTooltip = ({ active, payload }) => {
    if (!active) return null
    // Sort the payload by value so that the values are displayed in order
    payload.sort((a, b) => (a.value > b.value ? -1 : 1))
    return (
      <div className="custom-tooltip">
        {payload.map((item, index) => {
          return (
            <p key={index} className="label">
              {item.name}: {DataFormater(item.value)}
            </p>
          )
        })}
      </div>
    )
  }

  return (
    <div className="main-div-linechart">
      <section>
        <div className="ml-80 text-sm">
          {plotData.metricName}{' '}
          <Infopop text={plotData.description} title={plotData.metricName} />
        </div>
        <LineChart
          intractive={true}
          data={plotData.data}
          align="right"
          width={600}
          height={250}
          margin={{ top: 20, right: 50, left: 20, bottom: 20 }}
          className="line-chart"
        >
          <CartesianGrid strokeDasharray="3 3" />
          <YAxis
            tickFormatter={DataFormater}
            className="y-axis-chart"
            // label={
            //   <text x={200} y={0} dx={50} dy={15} offset={0} angle={-90}>
            //     {plotData.metricName}
            //   </text>
            // }
          />
          <XAxis className="x-axis-chart" interval={0} dataKey="name" />
          <Legend />

          {/* The following allows multiple lines to be plotted in the same
          LineChart */}
          {plotData.nameCompany.map((name, index) => (
            <Line
              strokeWidth={plotData.strokeWidth[plotData.companyOrder[name]]}
              datasetFill={true}
              key={index}
              isAnimationActive={false}
              type="monotone"
              dataKey={name}
              stroke={stroke[plotData.companyOrder[name]]}
            />
          ))}
          <Tooltip
            content={(active, payload) => CustomTooltip(active, payload)}
          />
          <Brush dataKey="name" height={40} />
        </LineChart>
      </section>
    </div>
  )
}
