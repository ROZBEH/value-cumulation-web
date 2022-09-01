const OpenAI = require('openai-api')

import { fineTuneData } from './fineTuneData.js'

export const gptIntelligence = async (inputQuery) => {
  const query = 'Q: ' + inputQuery
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY
  const openai = new OpenAI(OPENAI_API_KEY)

  const gptResponse = await openai.complete({
    engine: 'davinci',
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
