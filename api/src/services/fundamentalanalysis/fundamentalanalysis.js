import { Checklist } from './Checklist'

export const getFundamental = async ({ ticker, metrics }) => {
  const checklist = new Checklist(ticker)
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

  return {
    ticker: ticker,
    intrinsic_value: results,
  }
}
