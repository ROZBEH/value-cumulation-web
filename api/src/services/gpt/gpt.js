/**
Value Cumulation
Copyright (c) 2022 Value Cumulation

Notice: All code and information in this repository is the property of Value Cumulation.
You are strictly prohibited from distributing or using this repository unless otherwise stated.
 */
import { companyslist } from 'src/services/searchbar/searchbar.js'

const { Configuration, OpenAIApi } = require('openai')
// const OpenAI = require('openai-api')

export const gptIntelligence = async (inputQuery) => {
  try {
    const configuration = new Configuration({
      // apiKey: 'process.env.OPENAI_',
      apiKey: process.env.OPENAI_API_KEY,
    })
    const openai = new OpenAIApi(configuration)

    const messages = [
      {
        role: 'system',
        content: `Give your response comma separated. Don't explain. If the user asked companies similar to AAPL, then you name 4 companies in the form of MSFT, TSLA, META, INTL`,
      },
      { role: 'user', content: 'Companies similar to PFE' },
      {
        role: 'assistant',
        content: 'JNJ, MRK, GSK, ABBV',
      },
      { role: 'user', content: 'Companies similar to ' + inputQuery.query },
    ]
    const gptPromise = openai.createChatCompletion({
      model: 'gpt-4',
      messages,
      max_tokens: 20,
      temperature: 0.5,
    })

    const promises = []
    promises.push(gptPromise)
    promises.push(companyslist())

    const promiseResults = await Promise.allSettled(promises)

    const gptResponseResult = promiseResults[0]
    const companyListResult = promiseResults[1]

    if (gptResponseResult.status === 'rejected') {
      throw new Error('AI API call failed: ' + gptResponseResult.reason)
    }

    if (companyListResult.status === 'rejected') {
      throw new Error(
        'Company list API call failed: ' + companyListResult.reason
      )
    }

    const gptResponse = gptResponseResult.value
    const companyList = companyListResult.value

    var apiResArr = gptResponse.data.choices[0].message.content.split(', ')

    apiResArr = apiResArr.filter((item) => item !== inputQuery.query)

    const Res = companyList.filter((company) =>
      apiResArr.some((res) => res === company.symbol)
    )

    return {
      query: inputQuery.query,
      response: Res,
      error: null,
    }
  } catch (error) {
    console.error('An error occurred:', error)
    // Return an empty result with an error message
    return {
      query: inputQuery.query,
      response: [],
      error: error.message,
    }
  }
}

export const gptIntelligenceGroup = async (inputQuery, _info) => {
  try {
    const queryArr = inputQuery.query
    var companyList
    const startUPComps = ['AAPL', 'MSFT']

    if (queryArr.every((val, index) => val === startUPComps[index])) {
      const apiResArr = [
        ['MSFT', 'TSLA', 'META', 'INTL'],
        ['AAPL', 'TSLA', 'META', 'INTL'],
      ]

      companyList = await companyslist()

      const Res = apiResArr.map((arr) =>
        companyList.filter((company) =>
          arr.some((symbol) => symbol === company.symbol)
        )
      )

      return {
        query: inputQuery.query,
        response: Res,
        error: null,
      }
    }

    const promises = []
    queryArr.forEach((query) => {
      promises.push(gptIntelligence({ query }))
    })

    const promiseResults = await Promise.allSettled(promises)

    const gptResponseArr = promiseResults.map((result, index) => {
      if (result.status === 'rejected') {
        console.error(
          `Error in gptIntelligence for query: ${queryArr[index]}`,
          result.reason
        )
        return []
      }
      return result.value.response
    })

    return {
      query: queryArr,
      response: gptResponseArr,
      error: null,
    }
  } catch (error) {
    console.error('An error occurred:', error)
    // Return an empty result with an error message
    return {
      query: inputQuery.query,
      response: [],
      error: error.message,
    }
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
