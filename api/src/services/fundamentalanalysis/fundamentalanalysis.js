import { Checklist } from './Checklist'

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
