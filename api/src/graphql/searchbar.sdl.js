/**
Value Cumulation
Copyright (c) 2022 Value Cumulation

Notice: All code and information in this repository is the property of Value Cumulation.
You are strictly prohibited from distributing or using this repository unless otherwise stated.
 */

export const schema = gql`
  # The following will return a list of all available companies on NASDAQ and NYSE
  # with their symbol, name, price, exchange, and exchange short name, and type

  type Result {
    symbol: String!
    name: String!
    price: String!
    exchange: String!
    exchangeShortName: String!
    type: String!
  }

  type Query {
    companyslist: [Result!]! @skipAuth
  }
`
