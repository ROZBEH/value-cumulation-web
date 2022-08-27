import { fetch } from 'cross-undici-fetch'

export const gptIntelligence = async () => {
  // Calling the open AI API
  const response = await fetch(
    `https://financialmodelingprep.com/api/v3/stock/list?apikey=${process.env.OPENAI_API_KEY}`
  )
  const jsonRes = await response.json()

  return jsonRes
}
