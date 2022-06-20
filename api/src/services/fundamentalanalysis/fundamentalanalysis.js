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

async function callApi(ticker, metric) {
  const checklist = new Checklist(ticker.toUpperCase())
  await checklist.initialize()
  let companyName
  try {
    companyName = checklist.companyName()
  } catch (err) {
    console.log('Please pick a valid ticker')
  }

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
    .reverse()
    .map((item, _index) => item.split('-')[0])

  //Uppper case the metric
  var metricName = metric.replace(/([A-Z])/g, ' $1')
  metricName = metricName.charAt(0).toUpperCase() + metricName.slice(1)
  return { companyName, metricName, result, yearArray }
}

export const getSingleMetric = async ({ ticker, metric }) => {
  const companyNames = []
  const metricNames = []
  const metricValues = []
  let yearArray = []
  for (let i = 0; i < ticker.length; i++) {
    const apiResult = await callApi(ticker[i], metric)
    companyNames.push(apiResult.companyName)
    metricNames.push(apiResult.metricName)
    metricValues.push(apiResult.result)
    yearArray = apiResult.yearArray
  }
  return {
    company_name: companyNames,
    metric_name: metricNames,
    metric_value: metricValues,
    years: yearArray,
  }
}
