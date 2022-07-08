import { Checklist } from './Checklist'
import { numFormatter } from './utilities'
export const getFundamental = async ({ ticker, metrics }) => {
  const checklist = new Checklist(ticker.toUpperCase())
  await checklist.initialize()
  const results = []
  if (metrics.includes('netProfitMargin') === true) {
    results.push(checklist.netProfitMargin())
  }
  if (metrics.includes('debtRatio') === true) {
    results.push(checklist.debtRatio())
  }
  if (metrics.includes('burnRatio') === true) {
    results.push(checklist.burnRatio())
  }
  if (metrics.includes('netIncome') === true) {
    results.push(checklist.netIncome())
  }

  return {
    ticker: ticker.toUpperCase(),
    intrinsic_value: results,
  }
}

async function callApi(ticker) {
  const checklist = new Checklist(ticker.toUpperCase())
  await checklist.initialize()
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
    var result = checklist[metric]().reverse()
    // floating point rounding up to 2 decimal places
    result = result.map((item) => Math.round(item * 100) / 100)
    // Format the numbers into Millions of Dollars
    if (result[result.length - 1] > 1000000000) {
      result = result.map((item) => {
        return numFormatter(item)
      })
    }
    results.push(result)
    // Get the year array
    const yearArray = checklist
      .latestYear()
      .reverse()
      .map((item, _index) => item.split('-')[0])

    // only get the years that data exists in the result array for that year
    years.push(yearArray.reverse().slice(0, result.length))

    //Uppper case the metric
    var metricName = metric.replace(/([A-Z])/g, ' $1')
    metricNames.push(metricName.charAt(0).toUpperCase() + metricName.slice(1))
  }

  return { companyName, metrics, metricNames, results, years }
}

export const getSingleMetric = async ({ ticker }) => {
  const apiResult = await callApi(ticker)

  return {
    company_name: apiResult.companyName,
    metric_names: apiResult.metrics,
    full_metric_names: apiResult.metricNames,
    metric_value: apiResult.results,
    years: apiResult.years,
  }
}
