import { fetch } from 'cross-undici-fetch'
import { DataFrame, toCSV } from 'danfojs-node'
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
      `https://financialmodelingprep.com/api/v3/${statementType}/${ticker}?apikey=${process.env.API_KEY}`
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

  companyName = () => {
    /* Returns the company name */
    return this.companyProfile['companyName'].values[0]
  }

  netIncome = (years = 10) => {
    /* Net Income of the company for a given number of years */
    return this.dfIncomeStatement['netIncome'].values.slice(0, years)
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
    /* change in revenue over the years */
    return this.metricDelta(this.dfIncomeStatement, 'revenue', years)
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
    const researchAndDevelopmentExpenses = this.dfIncomeStatement[
      'researchAndDevelopmentExpenses'
    ].values.slice(0, years)
    const revenue = this.dfIncomeStatement['revenue'].values.slice(0, years)
    return researchAndDevelopmentExpenses.map(function (n, i) {
      return n / revenue[i]
    })
  }

  grossProfitMargin = (years = 10) => {
    /* Gross Profit Margin over the years: It's ratio of gross profit to revenue
     which is the (Revenue -cost of goods sold)/Revenue */

    return this.dfFinancialRatios['grossProfitMargin'].values.slice(0, years)
  }

  latestYear = (years = 10) => {
    /* Returns the latest year of the financial data */
    return this.dfIncomeStatement['date'].values.slice(0, years)
  }

  netProfitMargin = (years = 10) => {
    /* Net Profit Margin over the years: It's ratio of net profit to revenue
     which is the (Net Income)/Revenue */
    return this.dfFinancialRatios['netProfitMargin'].values.slice(0, years)
  }

  priceToEarning = (years = 10) => {
    /* Price to Earning over the years: It's ratio of price to earning */
    return this.dfFinancialRatios['priceEarningsRatio'].values.slice(0, years)
  }

  debtRatio = (years = 10) => {
    /* Debt Ratio: Total Liability / Total Assets */
    return this.dfFinancialRatios['debtRatio'].values.slice(0, years)
  }

  currentRatio = (years = 10) => {
    /* Current Ratio: Current Assets / Current Liabilities */
    return this.dfFinancialRatios['currentRatio'].values.slice(0, years)
  }

  priceToFreeCashFlowsRatio = (years = 10) => {
    /* priceToFreeCashFlowsRatio: Price of Share over Free Cashflow per share */
    return this.dfFinancialRatios['priceToFreeCashFlowsRatio'].values.slice(
      0,
      years
    )
  }

  freeCashFlow = (years = 10) => {
    /* Free cash flow over the years. As Investopedia defines: cash a company
     generates after taking into consideration cash outflows that support its
     operations and maintain its capital assets
     https://www.investopedia.com/ask/answers/033015/what-formula-calculating-free-cash-flow.asp
    */
    return this.dfCashFlowStatement['freeCashFlow'].values.slice(0, years)
  }

  operatingCashFlow = (years = 10) => {
    /* Operating cash flow over the years. Cash Flow from Operating Activities.
     Does the company generate enough cash after taking into account it's operations.*/
    return this.dfCashFlowStatement['operatingCashFlow'].values.slice(0, years)
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
    const totalCurrentLiabilities = this.dfBalanceSheetStatement[
      'totalCurrentLiabilities'
    ].values.slice(0, years)
    return operatingCashFlow.map(function (n, i) {
      return n / totalCurrentLiabilities[i]
    })
  }

  dividendYield = (years = 10) => {
    /* Dividend Yield: dividend per share divided by the price per share. It's a
     good indicator whether the company is dividend payer or price compounder.*/
    return this.dfFinancialRatios['dividendYield'].values.slice(0, years)
  }

  incomeTaxToNetIncome = (years = 10) => {
    /* Ratio of Income Tax to Net Income. It's a good indicator of whether the paid
     income tax grows as the net income increases. */
    const incomeTaxExpense = this.dfIncomeStatement[
      'incomeTaxExpense'
    ].values.slice(0, years)
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
    if (this.dfDividend && this.dfDividend['adjDividend']) {
      cumulativeDividend = this.dfDividend['adjDividend'].values
        .slice(0, years)
        .reduce((a, b) => a + b, 0)
    } else {
      cumulativeDividend = 0
    }

    const epsDilutedDeltaSinceStart =
      this.dfIncomeStatement['epsdiluted'].values[0] -
      this.dfIncomeStatement['epsdiluted'].values[years]

    const epsDivDelta = this.dfIncomeStatement['epsdiluted'].values
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
    const retainedEarnings = this.dfBalanceSheetStatement[
      'retainedEarnings'
    ].values.slice(1, years + 1)
    return marketCapDelta.map(function (n, i) {
      return n / retainedEarnings[i]
    })
  }

  meanNetIncomeGrowthRate = (years = 10) => {
    /* The average rate of change in net income over the years */
    const netIncomeDelta = this.metricDelta(
      this.dfIncomeStatement,
      'netIncome',
      years
    )
    const netIncome = this.dfIncomeStatement['netIncome'].values
    const growthRate = netIncomeDelta.map(function (n, i) {
      return n / netIncome[1 + i]
    })

    return [growthRate.reduce((a, b) => a + b, 0) / years]
  }

  meanFCFGrowthRate = (years = 10) => {
    /* The average rate of change in free cash flow over the years */
    const fcfDelta = this.metricDelta(
      this.dfCashFlowStatement,
      'freeCashFlow',
      years
    )
    const fcf = this.freeCashFlow(years + 1).slice(1, years + 1)
    const fcfGrowth = fcfDelta.map(function (n, i) {
      return n / fcf[i]
    })
    return [fcfGrowth.reduce((a, b) => a + b, 0) / years]
  }

  intrinsicValue = (
    years = 10,
    dRate = 0.1,
    confidence = 1.0,
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
    const meanFCFGrowthRate = this.meanFCFGrowthRate(years)[0]
    const meanNetIncomeGrowthRate = this.meanNetIncomeGrowthRate(years)[0]
    var growthRate = Math.max(meanFCFGrowthRate, meanNetIncomeGrowthRate)
    if (growthMultiple === 'MIN') {
      growthRate = Math.min(meanFCFGrowthRate, meanNetIncomeGrowthRate)
    }
    // Discounted Cash flow model
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
      return [(terminalValue + DCF) * confidence]
    } else {
      return [DCF * confidence]
    }
  }
}
