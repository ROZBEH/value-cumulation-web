// List of available metrics for now. This list will be updated as we
// decide on the list of metrics to be shown to the user.
const availableMetrics = [
  'netProfitMargin',
  'debtRatio',
  'netIncome',
  'freeCashFlow',
  'marketCapChangeWithRetainedEarnings',
  'grossProfitMargin',
  'burnRatio',
  'priceToEarning',
  'rAndDBudgetToRevenue',
  'currentRatio',
  'priceToFreeCashFlowsRatio',
  'operatingCashFlow',
  'freeCashFlowToNetIncome',
  'operatingCFToCurrentLiabilities',
  'dividendYield',
  'incomeTaxToNetIncome',
  'returnOnRetainedEarnings',
  'meanNetIncomeGrowthRate',
  'meanFCFGrowthRate',
  'intrinsicValue',
].sort()
export const AVAILABLE_METRICS = availableMetrics.map((item, index) => ({
  id: index,
  value: item,
  // First capitalize the first letter of the metric name and
  // then place space between capitalized section.
  title: (item[0].toUpperCase() + item.slice(1))
    .match(/[A-Z]+(?![a-z])|[A-Z]?[a-z]+|\d+/g)
    .join(' '),
}))
