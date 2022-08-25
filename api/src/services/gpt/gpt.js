import { fetch } from 'cross-undici-fetch'

export const gptIntelligence = async () => {
  // Get the list of all available companies from the API
  const response = await fetch(
    `https://financialmodelingprep.com/api/v3/stock/list?apikey=${process.env.API_KEY}`
  )
  const jsonRes = await response.json()

  return jsonRes
}
