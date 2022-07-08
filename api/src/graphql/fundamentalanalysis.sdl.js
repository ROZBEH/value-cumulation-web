export const schema = gql`
  type Fundamentals {
    ticker: String!
    intrinsic_value: [[Float]]!
  }
  type SingleMetric {
    company_name: String!
    metric_names: [String!]!
    full_metric_names: [String!]!
    metric_value: [[Float]!]!
    years: [[String!]!]!
  }

  type Query {
    getFundamental(ticker: String!, metrics: [String!]!): Fundamentals!
      @skipAuth
    getSingleMetric(ticker: String!): SingleMetric! @skipAuth
  }
`
