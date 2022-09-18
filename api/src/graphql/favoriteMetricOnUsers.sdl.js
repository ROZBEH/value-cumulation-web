/**
Value Cumulation
Copyright (c) 2022 Value Cumulation

Notice: All code and information in this repository is the property of Value Cumulation.
You are strictly prohibited from distributing or using this repository unless otherwise stated.
 */

export const schema = gql`
  type FavoriteMetricOnUser {
    id: Int!
    favoriteMetricId: Int!
    favoriteMetric: FavoriteMetric!
    userId: Int!
    user: User!
  }

  type Query {
    favoriteMetricOnUsers: [FavoriteMetricOnUser!]! @skipAuth
    favoriteMetricOnUser(id: Int!): FavoriteMetricOnUser @skipAuth
  }

  input CreateFavoriteMetricOnUserInput {
    favoriteMetricId: Int!
    userId: Int!
  }

  input UpdateFavoriteMetricOnUserInput {
    favoriteMetricId: Int
    userId: Int
  }

  # Adding the following type to the schema allows us to remove the relationship
  # between the FavoriteMetric and the User. Please go and check the deleteFavoriteMetricOnUser.js
  # inside the service script.
  input DeleteFavoriteMetricOnUserInput {
    name: String!
    userId: Int!
  }

  type Mutation {
    createFavoriteMetricOnUser(
      input: CreateFavoriteMetricOnUserInput!
    ): FavoriteMetricOnUser! @skipAuth
    updateFavoriteMetricOnUser(
      id: Int!
      input: UpdateFavoriteMetricOnUserInput!
    ): FavoriteMetricOnUser! @skipAuth
    deleteFavoriteMetricOnUser(
      input: DeleteFavoriteMetricOnUserInput!
    ): FavoriteMetricOnUser! @skipAuth
  }
`
