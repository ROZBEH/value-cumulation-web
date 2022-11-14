/**
Value Cumulation
Copyright (c) 2022 Value Cumulation

Notice: All code and information in this repository is the property of Value Cumulation.
You are strictly prohibited from distributing or using this repository unless otherwise stated.
 */

export const schema = gql`
  type FavoriteMetricOnUser {
    id: String!
    favoriteMetricId: String!
    favoriteMetric: FavoriteMetric!
    userId: String!
    user: User!
  }

  type Query {
    favoriteMetricOnUsers: [FavoriteMetricOnUser!]! @requireAuth
    favoriteMetricOnUser(id: String!): FavoriteMetricOnUser @requireAuth
  }

  input CreateFavoriteMetricOnUserInput {
    favoriteMetricId: String!
    userId: String!
  }

  input UpdateFavoriteMetricOnUserInput {
    favoriteMetricId: String
    userId: String
  }

  # Adding the following type to the schema allows us to remove the relationship
  # between the FavoriteMetric and the User. Please go and check the deleteFavoriteMetricOnUser.js
  # inside the service script.
  input DeleteFavoriteMetricOnUserInput {
    name: String!
    userId: String!
  }

  type Mutation {
    createFavoriteMetricOnUser(
      input: CreateFavoriteMetricOnUserInput!
    ): FavoriteMetricOnUser! @requireAuth
    updateFavoriteMetricOnUser(
      id: String!
      input: UpdateFavoriteMetricOnUserInput!
    ): FavoriteMetricOnUser! @requireAuth
    deleteFavoriteMetricOnUser(
      input: DeleteFavoriteMetricOnUserInput!
    ): FavoriteMetricOnUser! @requireAuth
  }
`
