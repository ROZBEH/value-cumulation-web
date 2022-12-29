/**
Value Cumulation
Copyright (c) 2022 Value Cumulation

Notice: All code and information in this repository is the property of Value Cumulation.
You are strictly prohibited from distributing or using this repository unless otherwise stated.
 */

/*
This is a one off script that can be run via
`yarn rw exec pullMetricRanges` to pull the ranges of all metrics from the API.
Running this script will result in saving the json response into a json file
inside api/fixtures
*/

import { Checklist } from 'api/src/services/fundamentalanalysis/Checklist.js'
import { metricsDefinition } from 'api/src/services/fundamentalanalysis/metricsDefinition.js'
import { companyslist } from 'api/src/services/searchbar/searchbar.js'

var fs = require('fs')

async function callApi(ticker) {
  const checklist = new Checklist(ticker.toUpperCase())
  await checklist.initialize()
  // List of available metrics. This list will get update
  // as new metrics are added to the API
  // The following metrics correspond to the name of the functions
  // in the Checklist class.
  var metrics = [
    'netIncome',
    'ratioCostOfRevenue',
    'burnRatio',
    'rAndDBudgetToRevenue',
    'grossProfitMargin',
    'netProfitMargin',
    'priceToEarning',
    'debtRatio',
    'currentRatio',
    'priceToFreeCashFlowsRatio',
    'freeCashFlow',
    'operatingCashFlow',
    'freeCashFlowToNetIncome',
    'operatingCFToCurrentLiabilities',
    'dividendYield',
    'incomeTaxToNetIncome',
    'returnOnRetainedEarnings',
    'marketCapChangeWithRetainedEarnings',
    'meanNetIncomeGrowthRate',
    'meanFCFGrowthRate',
    'intrinsicValue',
  ]
  let companyName
  try {
    companyName = checklist.companyName()
  } catch (err) {
    console.log('Please pick a valid ticker')
  }

  let results = []
  let years = []
  let metricNames = []
  let metricsDescription = []
  for (const metric of metrics) {
    metricsDescription.push(metricsDefinition[metric])
    var result = checklist[metric]().reverse()
    // floating point rounding up to 2 decimal places
    result = result.map((item) => Math.round(item * 100) / 100)
    // Format the numbers into Millions of Dollars
    // if (Math.abs(result[result.length - 1]) > 1000000) {
    //   result = result.map((item) => {
    //     return numFormatter(item)
    //   })
    // }
    // Get the year array
    const yearArray = checklist
      .latestYear()
      .map((item, _index) => item.split('-')[0])

    // if there are less than 10 years of data, fill in the rest with 0
    if (result.length < 10) {
      result.reverse()
      for (let i = result.length; i < 10; i++) {
        result.push(null)
      }
      result.reverse()
    }
    // Sometimes result contains Nan values because sometimes there isn't data for a certain year.
    // And we divide by that year's value as a result we get NaN. We need to replace them with null
    result = result.map((item) => {
      if (isNaN(item)) {
        return null
      } else {
        return item
      }
    })
    results.push(result)

    // if there are less than 10 years in years array, fill the rest with previous year
    if (yearArray.length < 10) {
      for (let i = yearArray.length; i < 10; i++) {
        yearArray.push((yearArray[i - 1] - 1).toString())
      }
      // yearArray.reverse()
    }

    // only get the years that data exists in the result array for that year
    years.push(yearArray.reverse().slice(0, result.length))
    //Uppper case the metric
    var metricName = metric.replace(/([A-Z])/g, ' $1')
    metricNames.push(metricName.charAt(0).toUpperCase() + metricName.slice(1))
  }

  const currency = checklist.getCurrency()

  const secReports = checklist.secReports

  return {
    companyName,
    metrics,
    metricNames,
    results,
    metricsDescription,
    secReports,
    years,
    currency,
  }
}

function sleep(milliseconds) {
  const date = Date.now()
  let currentDate = null
  do {
    currentDate = Date.now()
  } while (currentDate - date < milliseconds)
}

export default async ({ args }) => {
  const companyLists = await companyslist()
  var metricMaxMin = {}
  for (const key of Object.keys(metricsDefinition)) {
    metricMaxMin[key] = {
      max: Number.NEGATIVE_INFINITY,
      min: Number.POSITIVE_INFINITY,
    }
  }

  try {
    for (let l = 0; l < companyLists.length; l++) {
      const res = await callApi(companyLists[l].symbol)

      if (
        (typeof res.companyName != 'undefined') &
        (res.currency === 'USD') &
        (companyLists[l].type === 'stock')
      ) {
        for (let i = 0; i < res.metrics.length; i++) {
          var metric = res.metrics[i]
          var result = res.results[i]
          for (let j = 0; j < result.length; j++) {
            if (result[j] !== null && result[j] > metricMaxMin[metric].max) {
              if (result[j] !== Number.POSITIVE_INFINITY) {
                metricMaxMin[metric].max = result[j]
                metricMaxMin[metric].maxCompany = res.companyName
              }
            }
            if (result[j] !== null && result[j] < metricMaxMin[metric].min) {
              if (result[j] !== Number.NEGATIVE_INFINITY) {
                metricMaxMin[metric].min = result[j]
                metricMaxMin[metric].minCompany = res.companyName
              }
            }
          }
        }
      }
    }
  } catch (err) {
    console.log('err = ', err)
  }

  fs.writeFile(
    'api/fixtures/metricMaxMin.json',
    JSON.stringify(metricMaxMin, null, 4),
    function (err) {
      if (err) {
        console.log(err)
      }
    }
  )
}
