import { fetch } from 'cross-undici-fetch'

export const searchbar = async (inputQuery) => {
  const response = await fetch(
    `https://financialmodelingprep.com/api/v3/stock/list?apikey=30d0838215af7a980b24b41cab12410f`
  )
  const jsonRes = await response.json()

  let matches
  // Here Users is basically all the available ticker names
  console.log('inputQuery = ', inputQuery.input)
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
