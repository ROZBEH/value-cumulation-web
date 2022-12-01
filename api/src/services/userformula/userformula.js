/**
Value Cumulation
Copyright (c) 2022 Value Cumulation

Notice: All code and information in this repository is the property of Value Cumulation.
You are strictly prohibited from distributing or using this repository unless otherwise stated.
 */
import { fetch } from 'cross-undici-fetch'

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

export const getFilteredCompanies = async ({ input }) => {
  const allCompanyList = await fetch(
    `https://financialmodelingprep.com/api/v4/cash-flow-statement-bulk?year=2020&period=annual&apikey=${process.env.FINANCIAL_API_KEY}`
  )
    .then((res) => res.blob())
    .then((blob) => blob.text())
    // Convert the String(CSV format) to JSON
    .then((text) => csvToJson(text))

  const filteredCompanies = allCompanyList.filter((company) => {
    // Check if the company has all the required metrics
    for (const metric of input) {
      if (
        company.reportedCurrency === 'USD' &&
        company[metric.name] > metric.value
      ) {
        // pass
      } else {
        return false
      }
    }
    return true
  })

  return { names: ['Test 1', 'Test 2'] }
}
