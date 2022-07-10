import { fetch } from 'cross-undici-fetch'

export const searchbar = async () => {
  // Get the list of all available companies from the API
  const response = await fetch(
    `https://financialmodelingprep.com/api/v3/stock/list?apikey=${process.env.API_KEY}`
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

  return matches
}
