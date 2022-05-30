export const schema = gql`
  type Fundamentals {
    ticker: String!
    intrinsic_value: [[Float]]!
  }
  type SingleMetric {
    company_name: String!
    metric_name: String!
    metric_value: [Float]!
  }

  type Query {
    getFundamental(ticker: String!, metrics: [String!]!): Fundamentals!
      @skipAuth
    getSingleMetric(ticker: String!, metric: String!): SingleMetric! @skipAuth
  }
`
