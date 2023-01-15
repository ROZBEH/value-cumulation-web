/**
Value Cumulation
Copyright (c) 2022 Value Cumulation

Notice: All code and information in this repository is the property of Value Cumulation.
You are strictly prohibited from distributing or using this repository unless otherwise stated.
 */

export const schema = gql`
  # Creating the favorites type so that it can be returned in the query.
  type favorite {
    id: String!
    name: String!
  }

  type User {
    id: String!
    email: String!
    hashedpassword: String!
    salt: String!
    resetToken: String
    resetTokenExpiresAt: DateTime
    favorites: [favorite]
  }

  type Query {
    users: [User!]! @requireAuth
    user(id: String!): User @requireAuth
  }

  type Query {
    getCustomerId(id: ID!): String! @requireAuth
  }

  input CreateUserInput {
    email: String!
    hashedpassword: String!
    salt: String!
    resetToken: String
    resetTokenExpiresAt: DateTime
  }

  input UpdateUserInput {
    email: String
    hashedpassword: String
    salt: String
    resetToken: String
    resetTokenExpiresAt: DateTime
  }

  type Mutation {
    deleteAllFavoritesUser(id: String!): User @requireAuth
    createUser(input: CreateUserInput!): User! @requireAuth
    updateUser(id: String!, input: UpdateUserInput!): User! @requireAuth
    deleteUser(id: String!): User! @requireAuth
  }
`
