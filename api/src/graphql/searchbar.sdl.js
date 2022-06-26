export const schema = gql`
  type Result {
    symbol: String!
    name: String!
    price: String!
    exchange: String!
    exchangeShortName: String!
    type: String!
  }

  type Query {
    searchbar(input: String!): [Result!]! @skipAuth
  }
`
