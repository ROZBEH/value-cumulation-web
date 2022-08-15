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
    searchbar: [Result!]! @skipAuth
  }
`
