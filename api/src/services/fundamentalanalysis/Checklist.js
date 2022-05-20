import { fetch } from 'cross-undici-fetch'
import { DataFrame } from 'danfojs-node'

export class Checklist {
  ticker

  constructor(ticker) {
    this.ticker = ticker
  }
  async getFinancials(ticker, statementType) {
    const responseFinancial = await fetch(
      `https://financialmodelingprep.com/api/v3/${statementType}/${ticker}?apikey=30d0838215af7a980b24b41cab12410f`
    )
    const jsonFinancial = await responseFinancial.json()
    var dfFinancial
    if (statementType === 'historical-price-full/stock_dividend') {
      dfFinancial = new DataFrame(jsonFinancial['historical'])
    } else {
      dfFinancial = new DataFrame(jsonFinancial)
    }
    return dfFinancial
  }

  async initialize() {
    this.dfIncomeStatement = await this.getFinancials(
      this.ticker,
      'income-statement'
    )
    // Balance Sheet
    this.dfBalanceSheetStatement = await this.getFinancials(
      this.ticker,
      'balance-sheet-statement'
    )

    // Cash Flow Statement
    this.dfCashFlowStatement = await this.getFinancials(
      this.ticker,
      'cash-flow-statement'
    )

    //Financial Ratios
    this.dfFinancialRatios = await this.getFinancials(this.ticker, 'ratios')

    // Key Metrics
    this.dfKeyMetrics = await this.getFinancials(this.ticker, 'key-metrics')

    // Historical Dividends
    this.dfDividend = await this.getFinancials(
      this.ticker,
      'historical-price-full/stock_dividend'
    )
  }

  metricDelta = (statement, metric, years = 10) => {
    /*
    change in the metric of interest over the years. For example if the net income over the years is
    20, 15, 12, 14, 10 this will return 5, 3, -2, 4
    */
    const period1 = statement[metric].values.slice(0, -1)
    const period2 = statement[metric].values.slice(1)
    var diff = period1.map(function (item, index) {
      return item - period2[index]
    })
    return diff.slice(0, years)
  }

  revenueDelta = (years = 10) => {
    return this.metricDelta(this.dfIncomeStatement, 'revenue', years)
  }

  costRevenueDelta = (years = 10) => {
    return this.metricDelta(this.dfIncomeStatement, 'costOfRevenue', years)
  }

  operatingExpensesDelta = (years = 10) => {
    return this.metricDelta(this.dfIncomeStatement, 'operatingExpenses', years)
  }

  ratioCostOfRevenue = (years = 10) => {
    const costRevenueDelta = this.costRevenueDelta(years)
    const revenueDelta = this.revenueDelta(years)
    // Return element-wise division of two arrays
    return costRevenueDelta.map(function (n, i) {
      return n / revenueDelta[i]
    })
  }

  burnRatio = (years = 10) => {
    const operatingExpensesDelta = this.operatingExpensesDelta(years)
    const costRevenueDelta = this.costRevenueDelta(years)
    const revenueDelta = this.revenueDelta(years)
    const totalCost = operatingExpensesDelta.map(function (n, i) {
      return n + costRevenueDelta[i]
    })

    return totalCost.map(function (n, i) {
      return n / revenueDelta[i]
    })
  }

  rAndDBudgetToRevenue = (years = 10) => {
    const researchAndDevelopmentExpenses = this.dfIncomeStatement[
      'researchAndDevelopmentExpenses'
    ].values.slice(0, years)
    const revenue = this.dfIncomeStatement['revenue'].values.slice(0, years)
    return researchAndDevelopmentExpenses.map(function (n, i) {
      return n / revenue[i]
    })
  }
  grossProfitMargin = (years = 10) => {
    return this.dfFinancialRatios['grossProfitMargin'].values.slice(0, years)
  }

  netProfitMargin = (years = 10) => {
    return this.dfFinancialRatios['netProfitMargin'].values.slice(0, years)
  }

  priceToEarning = (years = 10) => {
    return this.dfFinancialRatios['priceEarningsRatio'].values.slice(0, years)
  }

  debtRatio = (years = 10) => {
    return this.dfFinancialRatios['debtRatio'].values.slice(0, years)
  }

  currentRatio = (years = 10) => {
    return this.dfFinancialRatios['currentRatio'].values.slice(0, years)
  }
  netIncome = (years = 10) => {
    return this.dfIncomeStatement['netIncome'].values.slice(0, years)
  }
}
