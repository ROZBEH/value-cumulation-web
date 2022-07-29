export const schema = gql`
  type User {
    id: Int!
    email: String!
    # hashedPassword: String!
    # salt: String!
    resetToken: String
    resetTokenExpiresAt: DateTime
    favoriteMetrics: [Metric]
  }

  # type Metric {
  #   id: Int!
  #   name: String!
  #   user: User
  #   userId: Int
  # }

  type Query {
    users: [User!]! @skipAuth
    user(id: Int!): User @skipAuth
  }

  # input CreateUserInput {
  #   email: String!
  #   hashedPassword: String!
  #   salt: String!
  #   resetToken: String
  #   resetTokenExpiresAt: DateTime
  # }
  input CreateMetricInput {
    name: String!
    userId: Int
  }

  # input UpdateUserInput {
  #   email: String
  #   resetToken: String
  #   resetTokenExpiresAt: DateTime
  # }
  input UpdateUserInput {
    email: String
    hashedPassword: String
    salt: String
    resetToken: String
    resetTokenExpiresAt: DateTime
  }

  type Mutation {
    createMetric(input: CreateMetricInput!): Metric! @skipAuth
    # createUser(input: CreateUserInput!): User! @skipAuth
    # updateUser(id: Int!, metric: Metric, input: UpdateUserInput!): User! @skipAuth
    # deleteUser(id: Int!): User! @skipAuth
  }
`
