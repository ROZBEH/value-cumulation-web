import { fetch } from 'cross-undici-fetch'

export const searchbar = async () => {
  const response = await fetch(
    `https://financialmodelingprep.com/api/v3/stock/list?apikey=${process.env.API_KEY}`
  )
  const jsonRes = await response.json()

  let matches
  // Here Users is basically all the available ticker names
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
