/**
Value Cumulation
Copyright (c) 2022 Value Cumulation

Notice: All code and information in this repository is the property of Value Cumulation.
You are strictly prohibited from distributing or using this repository unless otherwise stated.
 */

export const schema = gql`
  # The following will return the input query as well as the
  # response provided by the API
  type companyFormat {
    symbol: String!
    name: String!
    price: String!
    exchange: String!
    exchangeShortName: String!
    type: String!
  }
  type Result {
    query: String!
    response: [companyFormat!]!
    error: String
  }
  type ResultGroup {
    query: [String!]!
    response: [[companyFormat!]!]!
    error: String
  }
  type Sentiment {
    query: String!
    sentiment: String!
  }

  type Query {
    gptIntelligence(query: String!): Result! @skipAuth
    gptIntelligenceGroup(query: [String!]!): ResultGroup! @skipAuth
    gptSentiment(query: String!): Sentiment! @skipAuth
  }
`
