/**
Value Cumulation
Copyright (c) 2022 Value Cumulation

Notice: All code and information in this repository is the property of Value Cumulation.
You are strictly prohibited from distributing or using this repository unless otherwise stated.
 */
import React, { useState, useEffect, useRef, useCallback } from 'react'

import { debounce } from 'lodash'
import {
  LineChart,
  Legend,
  Line,
  YAxis,
  CartesianGrid,
  Tooltip,
  XAxis,
  Brush,
  ReferenceLine,
} from 'recharts'

import { Infopop } from 'src/components/Infopop/Infopop'
import './PlotFundamentals.css'

export const PlotFundamentals = (props) => {
  const [zooming, setZooming] = useState(false)

  const chartContainer = useRef(null)
  const [zoomLevel, setZoomLevel] = useState(1)
  const plotData = props.plottingData[props.metric]
  const dataLength = plotData.data.length

  const [startIndex, setStartIndex] = useState(0)
  const [endIndex, setEndIndex] = useState(dataLength - 1)
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
    if (!active || !payload) return null
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
  const scrollSpeed = 0.05
  const handleScroll = debounce((event) => {
    const newZoomLevel =
      event.deltaY < 0 ? zoomLevel + scrollSpeed : zoomLevel - scrollSpeed

    if (newZoomLevel >= 0.5 && newZoomLevel <= 3) {
      const visibleDataLength = Math.max(
        1,
        Math.round(dataLength / newZoomLevel)
      )

      // Calculate the current mouse position in the chart
      const boundingRect = chartContainer.current.getBoundingClientRect()
      const mouseX = event.clientX - boundingRect.left
      const marginLeft = 17
      const marginRight = 17
      const dataWidth =
        chartContainer.current.clientWidth - marginLeft - marginRight
      const dataX = (mouseX / dataWidth) * (endIndex - startIndex) + startIndex

      // Adjust the start and end indices of the chart data to zoom around the current mouse position
      const newStartIndex = Math.max(
        Math.round(dataX - visibleDataLength / 2),
        0
      )
      const newEndIndex = Math.min(
        Math.round(dataX + visibleDataLength / 2),
        dataLength - 1
      )

      setZoomLevel(newZoomLevel)
      setStartIndex(newStartIndex)
      setEndIndex(newEndIndex)
    }
  }, 1)

  useEffect(() => {
    if (!chartContainer.current) return
    chartContainer.current.addEventListener('wheel', handleScroll)

    return () => {
      if (!chartContainer.current) return
      chartContainer.current.removeEventListener('wheel', handleScroll)
    }
  }, [chartContainer, handleScroll])

  console.log('startIndex:', startIndex, 'endIndex:', endIndex)
  console.log('Data slice:', plotData.data.slice(startIndex, endIndex + 1))

  return (
    <div className="main-div-linechart chart-container" ref={chartContainer}>
      <div className="ml-80 text-sm">
        {plotData.metricName}{' '}
        <Infopop text={plotData.description} title={plotData.metricName} />
      </div>

      <LineChart
        cursor="move"
        intractive={true}
        data={plotData.data.slice(startIndex, endIndex + 1)}
        align="right"
        width={650}
        height={300}
        margin={{ top: 10, right: 17, left: 17, bottom: 20 }}
        className="line-chart"
      >
        <CartesianGrid strokeDasharray="3 3" />
        <YAxis
          tickFormatter={DataFormater}
          className="y-axis-chart"
          // domain={yAxisDomain}
          // label={
          //   <text x={200} y={0} dx={50} dy={15} offset={0} angle={-90}>
          //     {plotData.metricName}
          //   </text>
          // }
        />
        <XAxis
          // domain={xAxisDomain}
          className="x-axis-chart"
          interval={0}
          dataKey="name"
        />
        <Brush
          stroke="transparent"
          fill="transparent"
          dataKey="name"
          height={1}
          startIndex={startIndex}
          endIndex={endIndex}
          onChange={({ startIndex, endIndex }) => {
            setStartIndex(startIndex)
            setEndIndex(endIndex)
          }}
        />
        <ReferenceLine x={plotData.data[startIndex].name} stroke="red" />
        <ReferenceLine x={plotData.data[endIndex].name} stroke="red" />
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
        {/* <Brush dataKey="name" height={40} /> */}
      </LineChart>
    </div>
  )
}
