export const schema = gql`
  type Metric {
    id: Int!
    name: String!
    user: User
    userId: Int
  }

  type Query {
    metrics: [Metric!]! @requireAuth
    metric(id: Int!): Metric @requireAuth
  }

  input CreateMetricInput {
    name: String!
    userId: Int
  }

  input UpdateMetricInput {
    name: String
    userId: Int
  }

  type Mutation {
    createMetric(input: CreateMetricInput!): Metric! @requireAuth
    updateMetric(id: Int!, input: UpdateMetricInput!): Metric! @requireAuth
    deleteMetric(id: Int!): Metric! @requireAuth
  }
`
