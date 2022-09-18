/**
Value Cumulation
Copyright (c) 2022 Value Cumulation

Notice: All code and information in this repository is the property of Value Cumulation.
You are strictly prohibited from distributing or using this repository unless otherwise stated.
 */

export const schema = gql`
  # The following will return the input query as well as the
  # response provided by the API
  type Result {
    query: String!
    response: [String!]!
  }
  type Sentiment {
    query: String!
    sentiment: String!
  }

  type Query {
    gptIntelligence(query: String!): Result! @skipAuth
    gptSentiment(query: String!): Sentiment! @skipAuth
  }
`
