/**
Value Cumulation
Copyright (c) 2022 Value Cumulation

Notice: All code and information in this repository is the property of Value Cumulation.
You are strictly prohibited from distributing or using this repository unless otherwise stated.
 */

import { fetch } from 'cross-undici-fetch'
import { DataFrame } from 'data-forge'

import {
  discountedCashFlowModelCalculator,
  terminalValueCalculator,
  median,
} from './utilities.js'

export class Checklist {
  ticker

  constructor(ticker) {
    this.ticker = ticker
  }

  async getSECReports(ticker) {
    const responseSEC = await fetch(
      `https://financialmodelingprep.com/api/v3/sec_filings/${ticker}?pages=0-20&apikey=${process.env.FINANCIAL_API_KEY}`
    )
    const jsonSECReports = await responseSEC.json()
    return jsonSECReports
  }
  async getFinancials(ticker, statementType) {
    const responseFinancial = await fetch(
      `https://financialmodelingprep.com/api/v3/${statementType}/${ticker}?apikey=${process.env.FINANCIAL_API_KEY}`
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
    // make all the call asynchronously to save time
    ;[
      this.secReports,
      this.companyProfile,
      this.dfIncomeStatement,
      this.dfBalanceSheetStatement,
      this.dfCashFlowStatement,
      this.dfFinancialRatios,
      this.dfKeyMetrics,
      this.dfDividend,
    ] = await Promise.all([
      this.getSECReports(this.ticker),
      this.getFinancials(this.ticker, 'profile'),
      this.getFinancials(this.ticker, 'income-statement'),
      this.getFinancials(this.ticker, 'balance-sheet-statement'),
      this.getFinancials(this.ticker, 'cash-flow-statement'),
      this.getFinancials(this.ticker, 'ratios'),
      this.getFinancials(this.ticker, 'key-metrics'),
      this.getFinancials(this.ticker, 'historical-price-full/stock_dividend'),
    ])
  }

  getCurrency = () => {
    /* Returns the currency of the company */
    const reportedCurr = this.dfIncomeStatement
      .getSeries('reportedCurrency')
      .toArray()[0]
    return reportedCurr
  }

  companyName = () => {
    /* Returns the company name */
    return this.companyProfile.getSeries('companyName').toArray()[0]
  }

  netIncome = (years = 10) => {
    /* Net Income of the company for a given number of years */
    return this.dfIncomeStatement
      .getSeries('netIncome')
      .toArray()
      .slice(0, years)
  }

  metricDelta = (statement, metric, years = 10) => {
    /*
    change in the metric of interest over the years. For example if the net income over the years is
    20, 15, 12, 14, 10 this will return 5, 3, -2, 4
    */
    const period1 = statement.getSeries(metric).toArray().slice(0, -1)
    const period2 = statement.getSeries(metric).toArray().slice(1)
    var diff = period1.map(function (item, index) {
      return item - period2[index]
    })
    return diff.slice(0, years)
  }

  revenueDelta = (years = 10) => {
    /* change in revenue over the years */
    return this.metricDelta(this.dfIncomeStatement, 'revenue', years)
  }

  revenue = (years = 10) => {
    /*revenue over the years */
    return this.dfIncomeStatement.getSeries('revenue').toArray().slice(0, years)
  }

  costRevenueDelta = (years = 10) => {
    /* change in cost of revenue over the years */
    return this.metricDelta(this.dfIncomeStatement, 'costOfRevenue', years)
  }

  operatingExpensesDelta = (years = 10) => {
    /* change in operating expenses over the years */
    return this.metricDelta(this.dfIncomeStatement, 'operatingExpenses', years)
  }

  ratioCostOfRevenue = (years = 10) => {
    /* ratio of cost of revenue to revenue. This shows how much the company
     needs to spend in order to increase $1 in the revenue */
    const costRevenueDelta = this.costRevenueDelta(years)
    const revenueDelta = this.revenueDelta(years)
    // Return element-wise division of two arrays
    return costRevenueDelta.map(function (n, i) {
      return n / revenueDelta[i]
    })
  }

  burnRatio = (years = 10) => {
    /* How much a company has to burn in order to make $1 in revenue */
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
    /* Ratio of R&D budget to revenue */
    const researchAndDevelopmentExpenses = this.dfIncomeStatement
      .getSeries('researchAndDevelopmentExpenses')
      .toArray()
      .slice(0, years)
    const revenue = this.dfIncomeStatement
      .getSeries('revenue')
      .toArray()
      .slice(0, years)
    return researchAndDevelopmentExpenses.map(function (n, i) {
      return n / revenue[i]
    })
  }

  grossProfitMargin = (years = 10) => {
    /* Gross Profit Margin over the years: It's ratio of gross profit to revenue
     which is the (Revenue -cost of goods sold)/Revenue */
    return this.dfFinancialRatios
      .getSeries('grossProfitMargin')
      .toArray()
      .slice(0, years)
  }

  latestYear = (years = 10) => {
    /* Returns the latest year of the financial data */
    return this.dfIncomeStatement.getSeries('date').toArray().slice(0, years)
  }

  netProfitMargin = (years = 10) => {
    /* Net Profit Margin over the years: It's ratio of net profit to revenue
     which is the (Net Income)/Revenue */
    return this.dfFinancialRatios
      .getSeries('netProfitMargin')
      .toArray()
      .slice(0, years)
  }

  priceToEarning = (years = 10) => {
    /* Price to Earning over the years: It's ratio of price to earning */
    return this.dfFinancialRatios
      .getSeries('priceEarningsRatio')
      .toArray()
      .slice(0, years)
  }

  debtRatio = (years = 10) => {
    /* Debt Ratio: Total Liability / Total Assets */
    return this.dfFinancialRatios
      .getSeries('debtRatio')
      .toArray()
      .slice(0, years)
  }

  currentRatio = (years = 10) => {
    /* Current Ratio: Current Assets / Current Liabilities */
    return this.dfFinancialRatios
      .getSeries('currentRatio')
      .toArray()
      .slice(0, years)
  }

  priceToFreeCashFlowsRatio = (years = 10) => {
    /* priceToFreeCashFlowsRatio: Price of Share over Free Cashflow per share */
    return this.dfFinancialRatios
      .getSeries('priceToFreeCashFlowsRatio')
      .toArray()
      .slice(0, years)
  }

  freeCashFlow = (years = 10) => {
    /* Free cash flow over the years. As Investopedia defines: cash a company
     generates after taking into consideration cash outflows that support its
     operations and maintain its capital assets
     https://www.investopedia.com/ask/answers/033015/what-formula-calculating-free-cash-flow.asp
    */
    return this.dfCashFlowStatement
      .getSeries('freeCashFlow')
      .toArray()
      .slice(0, years)
  }

  operatingCashFlow = (years = 10) => {
    /* Operating cash flow over the years. Cash Flow from Operating Activities.
     Does the company generate enough cash after taking into account it's operations.*/
    return this.dfCashFlowStatement
      .getSeries('operatingCashFlow')
      .toArray()
      .slice(0, years)
  }

  freeCashFlowToNetIncome = (years = 10) => {
    /* Ratio of Free Cash Flow to Net Income. It's a good indicator of how much of
     the company's net income is converted to cash. */
    const freeCashFlow = this.freeCashFlow(years)
    const netIncome = this.netIncome(years)
    return freeCashFlow.map(function (n, i) {
      return n / netIncome[i]
    })
  }

  operatingCFToCurrentLiabilities = (years = 10) => {
    /* Ratio of Operating Cash Flow to Current Liabilities. It's a good indicator of
     whether the company is able to pay off it's current liabilities. */
    const operatingCashFlow = this.operatingCashFlow(years)
    const totalCurrentLiabilities = this.dfBalanceSheetStatement
      .getSeries('totalCurrentLiabilities')
      .toArray()
      .slice(0, years)
    return operatingCashFlow.map(function (n, i) {
      return n / totalCurrentLiabilities[i]
    })
  }

  dividendYield = (years = 10) => {
    /* Dividend Yield: dividend per share divided by the price per share. It's a
     good indicator whether the company is dividend payer or price compounder.*/
    return this.dfFinancialRatios
      .getSeries('dividendYield')
      .toArray()
      .slice(0, years)
  }

  incomeTaxToNetIncome = (years = 10) => {
    /* Ratio of Income Tax to Net Income. It's a good indicator of whether the paid
     income tax grows as the net income increases. */
    const incomeTaxExpense = this.dfIncomeStatement
      .getSeries('incomeTaxExpense')
      .toArray()
      .slice(0, years)
    const netIncome = this.netIncome(years)
    return incomeTaxExpense.map(function (n, i) {
      return n / netIncome[i]
    })
  }

  returnOnRetainedEarnings = (years = 10) => {
    /* Return on Retained Earnings: How is the management performing on the retained earnings
     Are they compounding the retained earning?
     (most recent EPS - first period EPS) / (cumulative EPS for the period - cumulative dividends paid for the period)
    */
    let cumulativeDividend
    if (
      this.dfDividend &&
      this.dfDividend.getSeries('adjDividend').toArray().length > 0
    ) {
      cumulativeDividend = this.dfDividend
        .getSeries('adjDividend')
        .toArray()
        .slice(0, years)
        .reduce((a, b) => a + b, 0)
    } else {
      cumulativeDividend = 0
    }

    const epsDilutedDeltaSinceStart =
      this.dfIncomeStatement.getSeries('epsdiluted').toArray()[0] -
      this.dfIncomeStatement.getSeries('epsdiluted').toArray()[
        Math.min(
          years,
          this.dfIncomeStatement.getSeries('epsdiluted').toArray().length - 1
        )
      ]

    const epsDivDelta = this.dfIncomeStatement
      .getSeries('epsdiluted')
      .toArray()
      .slice(0, years)
      .reduce((a, b) => a + b, 0)

    return [epsDilutedDeltaSinceStart / (epsDivDelta - cumulativeDividend)]
  }

  marketCapChangeWithRetainedEarnings = (years = 10) => {
    /* How does a company's market cap change on $1 of retained earnings?
     You would want the ratio to be greater than 1. A ratio of X means that the company
     converts $1 of retained earning into $X in market Cap. */
    const marketCapDelta = this.metricDelta(
      this.dfKeyMetrics,
      'marketCap',
      years
    )
    const retainedEarnings = this.dfBalanceSheetStatement
      .getSeries('retainedEarnings')
      .toArray()
      .slice(1, years + 1)
    return marketCapDelta.map(function (n, i) {
      return n / retainedEarnings[i]
    })
  }

  meanNetIncomeGrowthRate = (years = 20) => {
    /* The average rate of change in net income over the years */
    const netIncomeDelta = this.metricDelta(
      this.dfIncomeStatement,
      'netIncome',
      years
    )
    const netIncome = this.dfIncomeStatement.getSeries('netIncome').toArray()
    var growthRate = netIncomeDelta.map(function (n, i) {
      return n / netIncome[1 + i]
    })
    // smooth the net income growth rate
    const growthMedian = median(growthRate)
    growthRate = growthRate.map((item) => {
      if (item > 1.0 && item > growthMedian) {
        return growthMedian
      } else {
        return item
      }
    })
    // So we'll calculate the average growth rate over the last 10 years, then the last 10 years starting from
    // from last year. Then the last 10 years starting from 2 years ago and so on.
    const avgPeriod = 10
    const netIncomeGrowthRate = []
    for (let i = 0; i < avgPeriod; i++) {
      netIncomeGrowthRate.push(
        growthRate.slice(i, i + avgPeriod).reduce((a, b) => a + b, 0) /
          avgPeriod
      )
    }
    return netIncomeGrowthRate
  }

  meanFCFGrowthRate = (years = 20) => {
    /* The average rate of change in free cash flow over the years */
    const fcfDelta = this.metricDelta(
      this.dfCashFlowStatement,
      'freeCashFlow',
      years
    )
    // Calculate the growth rate over a 10 year period
    const fcf = this.freeCashFlow(years + 1).slice(1, years + 1)
    var fcfGrowth = fcfDelta.map(function (n, i) {
      return n / fcf[i]
    })
    // smooth the growth rate
    const growthMedian = median(fcfGrowth)
    fcfGrowth = fcfGrowth.map((item) => {
      if (item > 1.0 && item > growthMedian) {
        return growthMedian
      } else {
        return item
      }
    })
    // So we'll calculate the average growth rate over the last 10 years, then the last 10 years starting from
    // from last year. Then the last 10 years starting from 2 years ago and so on.
    const avgPeriod = 10
    const fcfGrowthRate = []
    for (let i = 0; i < avgPeriod; i++) {
      fcfGrowthRate.push(
        fcfGrowth.slice(i, i + avgPeriod).reduce((a, b) => a + b, 0) / avgPeriod
      )
    }
    return fcfGrowthRate
  }

  intrinsicValue = (
    years = 10,
    dRate = 0.1,
    confidence = 0.5,
    terminalGrowthRate = 0.01,
    growthMultiple = 'MIN',
    includeTerminalValue = true
  ) => {
    /* Given the financials of the company, what's the intrinsic value of this business?
     years: Number of years into the future to make the calculations
     d_rate: Best low risk rate of return that you could achieve on the capital. It could be
        return of s&p500 or treasury rate. Whichever you're 100% sure that you can achieve
        that return without risk of losing your capital.
     confidence: How much confident are you with these numbers. A value between 0 and 1
     growth_multiple: Do you want to consider the MIN of (FCF, net_income) as your
        growth rate or the MAX of these two values? */
    var intrinsicValue = []
    const meanFCFGrowthRate = this.meanFCFGrowthRate(years * 2)
    const meanNetIncomeGrowthRate = this.meanNetIncomeGrowthRate(years * 2)

    for (let i = 0; i < years; i++) {
      var growthRate = Math.max(
        meanFCFGrowthRate[i],
        meanNetIncomeGrowthRate[i]
      )
      if (growthMultiple === 'MIN') {
        growthRate = Math.min(meanFCFGrowthRate[i], meanNetIncomeGrowthRate[i])
      }

      // if the company has a negative growth rate
      if (growthRate < 0) {
        growthRate = 0
      }
      // Discounted Cash flow model
      const DCF = discountedCashFlowModelCalculator(
        this.freeCashFlow(years)[i],
        years,
        growthRate,
        dRate
      )
      const fcfYearN =
        this.freeCashFlow(years)[i] * ((1 + growthRate) / (1 + dRate)) ** years
      const terminalValue = terminalValueCalculator(
        fcfYearN,
        terminalGrowthRate,
        dRate
      )
      if (includeTerminalValue) {
        intrinsicValue.push((terminalValue + DCF) * confidence)
      } else {
        intrinsicValue.push(DCF * confidence)
      }
    }

    return intrinsicValue
  }
}
