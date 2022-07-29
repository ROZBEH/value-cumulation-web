export const schema = gql`
  # type User {
  #   id: Int!
  #   email: String!
  #   # hashedPassword: String!
  #   # salt: String!
  #   resetToken: String
  #   resetTokenExpiresAt: DateTime
  #   favoriteMetrics: [Metric]
  # }
  type Metric {
    id: Int!
    name: String!
    user: User
    userId: Int
  }

  type Query {
    metrics: [Metric!]! @skipAuth
    metric(id: Int!): Metric @skipAuth
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
    createMetric(input: CreateMetricInput!): Metric! @skipAuth
    updateMetric(id: Int!, input: UpdateMetricInput!): Metric! @skipAuth
    deleteMetric(id: Int!): Metric! @skipAuth
  }
`
