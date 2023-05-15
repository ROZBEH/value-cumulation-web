/**
Value Cumulation
Copyright (c) 2022 Value Cumulation

Notice: All code and information in this repository is the property of Value Cumulation.
You are strictly prohibited from distributing or using this repository unless otherwise stated.
 */

import { fetch } from '@whatwg-node/fetch'

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
      // res.symbol &
      // res.name &
      // res.price &
      // res.exchange &
      // res.exchangeShortName &
      // res.type
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

  // filter out the ones that the type is stock
  matches = matches.filter((res) => {
    if (res.type === 'stock') {
      return true
    } else {
      return null
    }
  })

  return matches
}
