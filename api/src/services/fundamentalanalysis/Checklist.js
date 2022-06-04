import { fetch } from 'cross-undici-fetch'
import { DataFrame } from 'danfojs-node'
import {
  discountedCashFlowModelCalculator,
  terminalValueCalculator,
} from './utilities'

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
    // Company Profile Information
    this.companyProfile = await this.getFinancials(this.ticker, 'profile')

    // Income Statement
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

  netIncome = (years = 10) => {
    return this.dfIncomeStatement['netIncome'].values.slice(0, years)
  }

  companyName = () => {
    return this.companyProfile['companyName'].values[0]
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

  priceToFreeCashFlowsRatio = (years = 10) => {
    return this.dfKeyRatios['priceToFreeCashFlowsRatio'].values.slice(0, years)
  }

  freeCashFlow = (years = 10) => {
    return this.dfCashFlowStatement['freeCashFlow'].values.slice(0, years)
  }

  operatingCashFlow = (years = 10) => {
    return this.dfCashFlowStatement['operatingCashFlow'].values.slice(0, years)
  }

  freeCashFlowToNetIncome = (years = 10) => {
    const freeCashFlow = this.freeCashFlow(years)
    const netIncome = this.netIncome(years)
    return freeCashFlow.map(function (n, i) {
      return n / netIncome[i]
    })
  }

  operatingCFToCurrentLiabilities = (years = 10) => {
    const operatingCashFlow = this.operatingCashFlow(years)
    const totalCurrentLiabilities = this.dfBalanceSheetStatement[
      'totalCurrentLiabilities'
    ].values.slice(0, years)
    return operatingCashFlow.map(function (n, i) {
      return n / totalCurrentLiabilities[i]
    })
  }

  dividendYield = (years = 10) => {
    return this.dfKeyRatios['dividendYield'].values.slice(0, years)
  }

  incomeTaxToNetIncome = (years = 10) => {
    const incomeTaxExpense = this.dfIncomeStatement[
      'incomeTaxExpense'
    ].values.slice(0, years)
    const netIncome = this.netIncome(years)
    return incomeTaxExpense.map(function (n, i) {
      return n / netIncome[i]
    })
  }

  returnOnRetainedEarnings = (years = 10) => {
    let cumulativeDividend
    if (this.dfDividend) {
      cumulativeDividend = this.dfDividend['adjDividend'].values
        .slice(0, years)
        .reduce((a, b) => a + b, 0)
    } else {
      cumulativeDividend = 0
    }
    const epsDilutedDeltaSinceStart =
      this.dfIncomeStatement['epsDiluted'].values[0] -
      this.dfIncomeStatement['epsDiluted'].values[years - 1]

    const epsDivDelta =
      this.dfIncomeStatement['epsDiluted'].values
        .slice(0, years)
        .reduce((a, b) => a + b, 0) - cumulativeDividend

    return epsDilutedDeltaSinceStart / epsDivDelta
  }

  marketCapChangeWithRetainedEarnings = (years = 10) => {
    const marketCapDelta = this.metricDelta(
      this.dfKeyMetrics,
      'marketCap',
      years
    )
    const retainedEarnings = this.dfBalanceSheetStatement[
      'retainedEarnings'
    ].values.slice(1, years + 1)
    return marketCapDelta.map(function (n, i) {
      return n / retainedEarnings[i]
    })
  }

  meanNetIncomeGrowthRate = (years = 10) => {
    const netIncomeDelta = this.metricDelta(
      this.dfIncomeStatement,
      'netIncome',
      years
    )
    const growthRate = netIncomeDelta.map(function (n, i) {
      return n / this.dfIncomeStatement['netIncome'].values[1 + i]
    })

    return growthRate.reduce((a, b) => a + b, 0) / years
  }

  meanFCFGrowthRate = (years = 10) => {
    const fcfDelta =
      this.freeCashFlow(years).slice(0, years) -
      this.freeCashFlow(years).slice(1, years + 1)
    const fcfGrowth = fcfDelta.map(function (n, i) {
      return n / this.freeCashFlow(years).slice(1, years + 1)[i]
    })
    return fcfGrowth.reduce((a, b) => a + b, 0) / years
  }

  intrinsicValue = (
    years = 10,
    dRate = 0.1,
    confidence = 1.0,
    terminalGrowthRate = 0.01,
    growthMultiple = 'MIN',
    includeTerminalValue = true
  ) => {
    const meanFCFGrowthRate = this.meanFCFGrowthRate(years)
    const meanNetIncomeGrowthRate = this.meanNetIncomeGrowthRate(years)
    var growthRate = Math.max(meanFCFGrowthRate, meanNetIncomeGrowthRate)
    if (growthMultiple === 'MIN') {
      growthRate = Math.min(meanFCFGrowthRate, meanNetIncomeGrowthRate)
    }
    const DCF = discountedCashFlowModelCalculator(
      this.freeCashFlow(years)[0],
      years,
      growthRate,
      dRate
    )
    const fcfYearN =
      this.freeCashFlow(years)[0] * ((1 + growthRate) / (1 + dRate)) ** years
    const terminalValue = terminalValueCalculator(
      fcfYearN,
      terminalGrowthRate,
      dRate
    )
    if (includeTerminalValue) {
      return (terminalValue + DCF) * confidence
    } else {
      return DCF * confidence
    }
  }
}
