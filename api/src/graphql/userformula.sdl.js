export const schema = gql`
  input inputMetric {
    name: String!
    value: Float!
  }
  type CompanyData {
    name: String!
    ticker: String!
    metrics: [String!]!
    values: [Float!]!
  }

  type Query {
    getFilteredCompanies(input: [inputMetric!]!): [CompanyData!]! @skipAuth
  }
`
