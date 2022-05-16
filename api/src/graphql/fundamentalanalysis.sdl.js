export const schema = gql`
  type Fundamentals {
    ticker: String!
    intrinsic_value: Float!
  }

  type Query {
    getFundamental(ticker: String!): Fundamentals! @skipAuth
  }
`
