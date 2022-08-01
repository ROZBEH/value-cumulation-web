export const schema = gql`
  type User {
    id: Int!
    email: String!
    # hashedPassword: String!
    # salt: String!
    resetToken: String
    resetTokenExpiresAt: DateTime
    favoriteMetrics: [String]
  }

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

  input UpdateUserInput {
    email: String
    resetToken: String
    resetTokenExpiresAt: DateTime
    favoriteMetrics: [String]
  }

  type Mutation {
    # createUser(input: CreateUserInput!): User! @skipAuth
    updateUser(id: Int!, input: UpdateUserInput!): User! @skipAuth
    # deleteUser(id: Int!): User! @skipAuth
  }
`
