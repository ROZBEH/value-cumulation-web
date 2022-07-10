export const schema = gql`
  # the following will query a specific company and get it's financials data
  # It will return company name as well as the financials data and the data
  # that accompanies it
  type SingleMetric {
    company_name: String!
    metric_names: [String!]!
    full_metric_names: [String!]!
    metric_value: [[Float]!]!
    years: [[String!]!]!
  }

  type Query {
    getSingleMetric(ticker: String!): SingleMetric! @skipAuth
  }
`
