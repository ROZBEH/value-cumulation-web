/**
Value Cumulation
Copyright (c) 2022 Value Cumulation

Notice: All code and information in this repository is the property of Value Cumulation.
You are strictly prohibited from distributing or using this repository unless otherwise stated.
 */

import { fetch } from 'cross-undici-fetch'

export const companyslist = async () => {
  // Get the list of all available companies from the API
  const response = await fetch(
    `https://financialmodelingprep.com/api/v3/stock/list?apikey=${process.env.FINANCIAL_API_KEY}`
  )
  const jsonRes = await response.json()

  let matches
  // Filter out only companies that exist on NASDAQ and NYSE
  matches = jsonRes.filter((res) => {
    if (
      res.exchangeShortName === 'NASDAQ' ||
      res.exchangeShortName === 'NYSE'
    ) {
      return true
    } else {
      return null
    }
  })
  matches = matches.map((res) => {
    return {
      symbol: res.symbol ? res.symbol : 'N/A',
      name: res.name ? res.name : 'N/A',
      price: res.price ? res.price : 'N/A',
      exchange: res.exchange ? res.exchange : 'N/A',
      exchangeShortName: res.exchangeShortName ? res.exchangeShortName : 'N/A',
      type: res.type ? res.type : 'N/A',
    }
  })

  return matches
}
