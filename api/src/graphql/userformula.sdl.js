export const schema = gql`
  input inputMetric {
    name: String!
    value: Float!
  }
  type CompanyNames {
    names: [String!]!
  }

  type Query {
    getFilteredCompanies(input: [inputMetric!]!): CompanyNames! @skipAuth
  }
`
