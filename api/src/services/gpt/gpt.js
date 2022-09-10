const OpenAI = require('openai-api')

import { fineTuneData } from './fineTuneData.js'

export const gptIntelligence = async (inputQuery) => {
  const query = 'Q: ' + inputQuery.query
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY
  const openai = new OpenAI(OPENAI_API_KEY)

  const gptResponse = await openai.complete({
    engine: 'text-davinci-002',
    prompt: fineTuneData + query + '\n',
    max_tokens: 100,
    temperature: 0.4,
    stop: ['Q: ', '\n'],
  })
  const aiRes = gptResponse.data.choices[0].text
  const aiResArrStr = aiRes.split('A: ')[1]
  var aiResArr = JSON.parse('[' + aiResArrStr + ']')[0]

  return {
    query: inputQuery.query,
    response: aiResArr,
  }
}

export const gptSentiment = async (inputQuery) => {
  const query = inputQuery.query
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY
  const openai = new OpenAI(OPENAI_API_KEY)
  const gptResponse = await openai.complete({
    engine: 'text-davinci-002',
    prompt:
      `Decide whether a Tweet\'s sentiment is positive, neutral, or negative.\n\nTweet: "` +
      query +
      `\"\nSentiment:`,
    temperature: 0,
    max_tokens: 60,
    top_p: 1.0,
    frequency_penalty: 0.5,
    presence_penalty: 0.0,
  })
  const sentiment = gptResponse.data.choices[0].text
  console.log('sentiment:', sentiment)
  return {
    query: inputQuery.query,
    sentiment: sentiment,
  }
}
