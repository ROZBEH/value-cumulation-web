/**
Value Cumulation
Copyright (c) 2022 Value Cumulation

Notice: All code and information in this repository is the property of Value Cumulation.
You are strictly prohibited from distributing or using this repository unless otherwise stated.
 */
import { fetch } from '@whatwg-node/fetch'

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

//This code shows an example of how to merge four arrays of objects based on a common key in
// JavaScript. It defines a function called mergeByKey that takes in a key and an arbitrary
// number of arrays to merge. The function uses the reduce() method to iterate over the
// arrays and merge them into a single array. Finally, the resulting merged array is returned
// by the function. You can include this code in the header of your JavaScript file to use the
// mergeByKey function in your code.
const mergeByKey = (key, ...arrays) => {
  return arrays.reduce((mergedArray, currentArray) => {
    if (currentArray.length === 0) {
      return mergedArray
    }

    currentArray.forEach((currentObj) => {
      const existingObj = mergedArray.find(
        (mergedObj) => mergedObj[key] === currentObj[key]
      )
      if (existingObj) {
        Object.assign(existingObj, currentObj)
      } else {
        mergedArray.push(currentObj)
      }
    })
    return mergedArray
  }, [])
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

async function getBulkStatement(statementType) {
  var today = new Date()
  var mm = String(today.getMonth() + 1).padStart(2, '0') //January is 0!
  var yyyy = today.getFullYear()
  // Only after january companies release their reports
  if (mm < 1) {
    yyyy = yyyy - 2
  } else {
    yyyy = yyyy - 1
  }
  const allCompanyStatements = await fetch(
    `https://financialmodelingprep.com/api/v4/${statementType}-bulk?year=${yyyy}&period=annual&apikey=${process.env.FINANCIAL_API_KEY}`
  )
    .then((res) => res.blob())
    .then((blob) => blob.text())
    // Convert the String(CSV format) to JSON
    .then((text) => csvToJson(text))

  return allCompanyStatements
}

function filterCompaniesData(
  statement,
  companyList,
  inputMetrics,
  forexRates,
  ratio = false
) {
  const filteredCompaniesData = []

  statement.filter((company) => {
    if (!companyList[company.symbol] || !companyList[company.symbol][0]) {
      return false
    }

    let exchangeRate
    if (company.reportedCurrency === 'USD') {
      exchangeRate = 1
    } else {
      exchangeRate = computeExchangeRate(company, forexRates)
    }

    for (const metric of inputMetrics) {
      if (
        (metric.name in company &&
          metric.name.endsWith('Ratio') &&
          company[metric.name] > metric.value) ||
        (metric.name in company &&
          ratio &&
          company[metric.name] > metric.value) ||
        (metric.name in company &&
          company[metric.name] * exchangeRate > metric.value)
      ) {
        // pass
      } else {
        return false
      }
    }

    const index = filteredCompaniesData.findIndex(
      (x) => x.name == companyList[company.symbol][1]
    )
    if (index === -1) {
      const metricsValues = {}

      inputMetrics.forEach((metric) => {
        const value =
          ratio == true || metric.name.endsWith('Ratio')
            ? company[metric.name]
            : company[metric.name] * exchangeRate

        metricsValues[metric.name] = value
      })
      filteredCompaniesData.push({
        ticker: company.symbol,
        name: companyList[company.symbol][1],
        ...metricsValues,
        //   metrics: inputMetrics.map((metric) => metric.name),
        //   values: inputMetrics.map((metric) =>
        //     ratio == true || metric.name.endsWith('Ratio')
        //       ? company[metric.name]
        //       : company[metric.name] * exchangeRate
        //   ),
      })
    }

    return true
  })

  return filteredCompaniesData
}

export const getFilteredCompanies = async ({ input }) => {
  // Wait for both exchange rate and bulk statement to be fetched

  const [
    exchangeRates,
    statementsIncome,
    statementsCashFlow,
    statementsBalanceSheet,
    statementsRatios,
    allcompanyList,
  ] = await Promise.all([
    getExchangeRate(),
    getBulkStatement('income-statement'),
    getBulkStatement('cash-flow-statement'),
    getBulkStatement('balance-sheet-statement'),
    getBulkStatement('ratios'),
    companyslist(),
  ])

  const forexRates = exchangeRates.forexList

  // Change allcompanyList to an object for faster lookup
  const companyList = {}
  for (const company of allcompanyList) {
    companyList[company.symbol] = [true, company.name, company.symbol]
  }

  const inputIncomeStatement = input.filter((metric) => {
    return metric.name in statementsIncome[0]
  })

  let filteredCompIncome
  if (inputIncomeStatement.length > 0) {
    filteredCompIncome = filterCompaniesData(
      statementsIncome,
      companyList,
      inputIncomeStatement,
      forexRates
    )
  } else {
    filteredCompIncome = []
  }

  const inputCashFlow = input.filter((metric) => {
    return metric.name in statementsCashFlow[0]
  })

  let filteredCompCashFlow
  if (inputCashFlow.length > 0) {
    filteredCompCashFlow = filterCompaniesData(
      statementsCashFlow,
      companyList,
      inputCashFlow,
      forexRates
    )
  } else {
    filteredCompCashFlow = []
  }

  const inputBalanceSheet = input.filter((metric) => {
    return metric.name in statementsBalanceSheet[0]
  })

  let filteredCompBalanceSheet
  if (inputBalanceSheet.length > 0) {
    filteredCompBalanceSheet = filterCompaniesData(
      statementsBalanceSheet,
      companyList,
      inputBalanceSheet,
      forexRates
    )
  } else {
    filteredCompBalanceSheet = []
  }

  const inputRatios = input.filter((metric) => {
    return metric.name in statementsRatios[0]
  })

  let filteredCompRatios
  if (inputRatios.length > 0) {
    filteredCompRatios = filterCompaniesData(
      statementsRatios,
      companyList,
      inputRatios,
      forexRates,
      true
    )
  } else {
    filteredCompRatios = []
  }

  const filteredCompaniesData = mergeByKey(
    'ticker',
    filteredCompCashFlow,
    filteredCompIncome,
    filteredCompBalanceSheet,
    filteredCompRatios
  )
  // now reorganize the data so the front end can access it properly
  const filteredCompanies = []
  const userMetrics = input.map((metric) => metric.name)

  for (const company of filteredCompaniesData) {
    const metrics = []
    const values = []
    for (const metric in company) {
      if (metric !== 'ticker' && metric !== 'name') {
        metrics.push(metric)
        values.push(company[metric])
      }
    }
    if (userMetrics.every((item) => metrics.includes(item))) {
      filteredCompanies.push({
        ticker: company.ticker,
        name: company.name,
        metrics: metrics,
        values: values,
      })
    }
  }

  return filteredCompanies
}
