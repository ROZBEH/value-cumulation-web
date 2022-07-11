import { Checklist } from './Checklist'
import { numFormatter } from './utilities'

async function callApi(ticker) {
  const checklist = new Checklist(ticker.toUpperCase())
  await checklist.initialize()
  // List of available metrics. This list will get update
  // as new metrics are added to the API
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
  for (const metric of metrics) {
    console.log('metric: ', metric)
    var result = checklist[metric]().reverse()
    // floating point rounding up to 2 decimal places
    result = result.map((item) => Math.round(item * 100) / 100)
    // Format the numbers into Millions of Dollars
    if (result[result.length - 1] > 1000000000) {
      result = result.map((item) => {
        return numFormatter(item)
      })
    }
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
    console.log('result: ', result)
    results.push(result)

    // if there are less than 10 years in years array, fill the rest with previous year
    if (yearArray.length < 10) {
      for (let i = yearArray.length; i < 10; i++) {
        yearArray.push((yearArray[i - 1] - 1).toString())
      }
      // yearArray.reverse()
    }
    console.log('yearArray: ', yearArray)

    // only get the years that data exists in the result array for that year
    years.push(yearArray.reverse().slice(0, result.length))
    //Uppper case the metric
    var metricName = metric.replace(/([A-Z])/g, ' $1')
    metricNames.push(metricName.charAt(0).toUpperCase() + metricName.slice(1))
    console.log('------------------------------')
  }

  return { companyName, metrics, metricNames, results, years }
}

export const getFundamentals = async ({ ticker }) => {
  console.log('here 1')
  const apiResult = await callApi(ticker)
  console.log('here 2')

  return {
    companyName: apiResult.companyName,
    metricNames: apiResult.metrics,
    fullMetricNames: apiResult.metricNames,
    metricValues: apiResult.results,
    years: apiResult.years,
  }
}
