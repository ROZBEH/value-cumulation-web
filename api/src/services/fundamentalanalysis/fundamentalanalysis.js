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

export const getSingleMetric = async ({ ticker, metric }) => {
  const checklist = new Checklist(ticker.toUpperCase())
  await checklist.initialize()
  let companyName
  try {
    companyName = checklist.companyName()
  } catch (err) {
    console.log('Please pick a valid ticker')
  }

  var result = checklist[metric]()
  // Format the numbers into Millions of Dollars
  if (result[0] > 1000000000) {
    result = result.map((item) => {
      return numFormatter(item)
    })
  }

  //Uppper case the metric
  var metricName = metric.replace(/([A-Z])/g, ' $1')
  metricName = metricName.charAt(0).toUpperCase() + metricName.slice(1)

  return {
    company_name: companyName,
    metric_name: metricName,
    metric_value: result,
  }
}
