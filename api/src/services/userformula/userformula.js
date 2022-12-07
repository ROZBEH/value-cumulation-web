/**
Value Cumulation
Copyright (c) 2022 Value Cumulation

Notice: All code and information in this repository is the property of Value Cumulation.
You are strictly prohibited from distributing or using this repository unless otherwise stated.
 */
import { fetch } from 'cross-undici-fetch'

import { companyslist } from 'src/services/searchbar/searchbar'
function csvToJson(csv) {
  // \n or \r\n depending on the EOL sequence
  const lines = csv.split('\r\n').filter((line) => line.length != 0)
  const delimeter = ','

  const result = []

  const headers = lines[0].split(delimeter)

  for (const line of lines) {
    const obj = {}
    const row = line.split(delimeter)

    for (let i = 0; i < headers.length; i++) {
      const header = headers[i]
      obj[header] = row[i]
    }

    result.push(obj)
  }

  // Prettify output
  // return JSON.stringify(result, null, 2)
  return result
}

async function getExchangeRate() {
  const exchangeRate = await fetch(
    `https://financialmodelingprep.com/api/v3/forex?apikey=${process.env.FINANCIAL_API_KEY}`
  ).then((res) => res.json())

  return exchangeRate
}

function computeExchangeRate(company, exchangeRates) {
  const exchangeRate = exchangeRates.find((item) => {
    if (item.ticker === company.reportedCurrency + '/USD') {
      return (item.bid + item.ask) / 2
    } else if (item.ticker === 'USD/' + company.reportedCurrency) {
      return 1 / ((item.bid + item.ask) / 2)
    } else {
      return false
    }
  })
  return exchangeRate
}

async function getBulkStatement() {
  const allCompanyStatements = await fetch(
    `https://financialmodelingprep.com/api/v4/cash-flow-statement-bulk?year=2020&period=annual&apikey=${process.env.FINANCIAL_API_KEY}`
  )
    .then((res) => res.blob())
    .then((blob) => blob.text())
    // Convert the String(CSV format) to JSON
    .then((text) => csvToJson(text))

  return allCompanyStatements
}

export const getFilteredCompanies = async ({ input }) => {
  // Wait for both exchange rate and bulk statement to be fetched
  const [exchangeRates, allCompanyStatements, allcompanyList] =
    await Promise.all([getExchangeRate(), getBulkStatement(), companyslist()])

  const forexRates = exchangeRates.forexList

  // Change allcompanyList to an object for faster lookup
  const companyList = {}
  for (const company of allcompanyList) {
    companyList[company.symbol] = [true, company.name, company.symbol]
  }

  var filteredCompaniesData = []
  allCompanyStatements.filter((company) => {
    // Check whether the company is listed on NASDAQ or NYSE
    if (!companyList[company.symbol] || !companyList[company.symbol][0]) {
      return false
    }
    // Check if the company has all the required metrics
    var exchangeRate
    if (company.reportedCurrency === 'USD') {
      exchangeRate = 1
    } else {
      exchangeRate = computeExchangeRate(company, forexRates)
    }

    for (const metric of input) {
      if (company[metric.name] * exchangeRate > metric.value) {
        // pass
      } else {
        return false
      }
    }

    // All the tests passed, time to save their data
    filteredCompaniesData.push({
      ticker: company.symbol,
      name: companyList[company.symbol][1],
      metrics: input.map((metric) => metric.name),
      values: input.map((metric) => {
        return company[metric.name] * exchangeRate
      }),
    })
    return true
  })

  console.log('filteredCompaniesData = ', filteredCompaniesData)

  return filteredCompaniesData
}
