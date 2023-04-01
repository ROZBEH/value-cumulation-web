/**
Value Cumulation
Copyright (c) 2022 Value Cumulation

Notice: All code and information in this repository is the property of Value Cumulation.
You are strictly prohibited from distributing or using this repository unless otherwise stated.
 */

import { companyslist } from 'src/services/searchbar/searchbar.js'

import { fineTuneData } from './fineTuneData.js'

const OpenAI = require('openai-api')

export const gptIntelligence = async (inputQuery) => {
  const query = 'Q: ' + inputQuery.query
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY
  const openai = new OpenAI(OPENAI_API_KEY)

  // For API reference please checkout the following link
  // https://beta.openai.com/docs/api-reference/completions/create
  const gptPromise = await openai.complete({
    engine: 'text-davinci-003',
    // engine: 'text-curie-001',
    // engine: 'text-ada-001',
    prompt: fineTuneData + query + '\n',
    max_tokens: 100,
    temperature: 1,
    presence_penalty: 2.0,
    frequency_penalty: 2.0,
    stop: ['Q: ', '\n'],
  })
  const promises = []
  promises.push(gptPromise)
  promises.push(companyslist())
  const promiseResults = await Promise.all(promises)
  const gptResponse = promiseResults[0]
  const companyList = promiseResults[1]
  const apiRes = gptResponse.data.choices[0].text
  var apiResArrStr = apiRes.split('A: ')[1]
  apiResArrStr = apiResArrStr.substr(1, apiResArrStr.length - 2)
  var apiResArr = apiResArrStr.split(', ')
  // filter the apiResArr to remove the ticker if it exists
  apiResArr = apiResArr.filter((item) => item !== inputQuery.query)

  const Res = companyList.filter((company) =>
    apiResArr.some((res) => res === company.symbol)
  )

  return {
    query: inputQuery.query,
    response: Res,
  }
}

export const gptIntelligenceGroup = async (inputQuery) => {
  // call the gptIntelligence function for each query
  const queryArr = inputQuery.query
  const gptResponseArr = []
  for (let i = 0; i < queryArr.length; i++) {
    const gptResponse = await gptIntelligence({
      query: queryArr[i],
    })
    gptResponseArr.push(gptResponse.response)
  }
  return {
    query: queryArr,
    response: gptResponseArr,
  }
}

export const gptSentiment = async (inputQuery) => {
  // Place holder for fetching financial data
  // link for the financial data
  // fetch(
  //   `https://www.sec.gov/Archives/edgar/data/320193/000032019322000059/aapl-20220326.htm`
  // )
  //   .then((res) => {
  //     return res.text()
  //   })
  //   .then((text) => {
  //     console.log(text)
  //   })
  // const query = inputQuery.query
  // const OPENAI_API_KEY = process.env.OPENAI_API_KEY
  // const openai = new OpenAI(OPENAI_API_KEY)
  // const gptResponse = await openai.complete({
  //   // engine: 'text-davinci-003',
  //   engine: 'text-curie-001',
  //   prompt:
  //     `Decide whether a Tweet\'s sentiment is positive, neutral, or negative.\n\nTweet: "` +
  //     query +
  //     `\"\nSentiment:`,
  //   temperature: 0,
  //   max_tokens: 60,
  //   top_p: 1.0,
  //   frequency_penalty: 0.5,
  //   presence_penalty: 0.0,
  // })
  // const sentiment = gptResponse.data.choices[0].text
  return {
    query: inputQuery.query,
    sentiment: 'positive',
  }
}
