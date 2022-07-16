export const schema = gql`
  # the following will query a specific company and get it's financials data
  # It will return company name as well as the financials data and the data
  # that accompanies it
  type FetchMetrics {
    companyName: String!
    metricNames: [String!]!
    fullMetricNames: [String!]!
    metricValues: [[Float]!]!
    years: [[String!]!]!
  }

  type Query {
    getFundamentals(ticker: String!): FetchMetrics! @requireAuth
  }
`
