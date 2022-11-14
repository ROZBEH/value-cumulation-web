export const schema = gql`
  # the following will query a specific company and get it's financials data
  # It will return company name as well as the financials data and the data
  # that accompanies it
  type secReport {
    symbol: String!
    fillingDate: String!
    acceptedDate: String!
    cik: String!
    type: String!
    link: String!
    finalLink: String!
  }
  type FetchMetrics {
    companyName: String!
    metricNames: [String!]!
    fullMetricNames: [String!]!
    metricValues: [[Float]!]!
    metricsDescription: [String!]!
    secReports: [secReport!]!
    years: [[String!]!]!
  }

  type Query {
    getFundamentals(ticker: String!): FetchMetrics! @requireAuth
  }
`
