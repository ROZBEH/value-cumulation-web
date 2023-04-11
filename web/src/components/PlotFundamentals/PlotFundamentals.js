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
  // Brush,
} from 'recharts'
import { useRecoilValue } from 'recoil'

import { Infopop } from 'src/components/Infopop/Infopop'
import { calledCompanies as calledCompaniesAtom } from 'src/recoil/atoms'
import './PlotFundamentals.css'

export const PlotFundamentals = (props) => {
  const plotData = props.plottingData[props.metric]
  const calledCompanies = useRecoilValue(calledCompaniesAtom)
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
    if (!active & !payload) return null
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
      <div className="ml-80 text-sm">
        {plotData.metricName}{' '}
        <Infopop text={plotData.description} title={plotData.metricName} />
      </div>
      <LineChart
        intractive={true}
        data={plotData.data}
        align="right"
        width={650}
        height={300}
        margin={{ top: 10, right: 17, left: 17, bottom: 20 }}
        className="line-chart"
      >
        <CartesianGrid strokeDasharray="3 3" />
        <YAxis tickFormatter={DataFormater} className="y-axis-chart" />
        <XAxis className="x-axis-chart" interval={0} dataKey="name" />
        <Legend />

        {plotData.nameCompany.map((name, index) => (
          <Line
            strokeWidth={plotData.strokeWidth[index]}
            datasetFill={true}
            key={index}
            isAnimationActive={false}
            type="monotone"
            dataKey={name}
            stroke={stroke[index]}
          />
        ))}
        <Tooltip
          content={(active, payload) => CustomTooltip(active, payload)}
        />
        {/* <Brush dataKey="name" height={40} /> */}
      </LineChart>
    </div>
  )
}
