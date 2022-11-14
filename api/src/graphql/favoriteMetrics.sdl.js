/**
Value Cumulation
Copyright (c) 2022 Value Cumulation

Notice: All code and information in this repository is the property of Value Cumulation.
You are strictly prohibited from distributing or using this repository unless otherwise stated.
 */

export const schema = gql`
  type FavoriteMetric {
    id: String!
    name: String!
  }

  type Query {
    favoriteMetrics: [FavoriteMetric!]! @requireAuth
    favoriteMetric(id: String!): FavoriteMetric @requireAuth
  }

  input CreateFavoriteMetricInput {
    name: String!
    userId: String!
  }

  input UpdateFavoriteMetricInput {
    name: String
  }

  type Mutation {
    createFavoriteMetric(input: CreateFavoriteMetricInput!): FavoriteMetric!
      @requireAuth
    updateFavoriteMetric(
      id: String!
      input: UpdateFavoriteMetricInput!
    ): FavoriteMetric! @requireAuth
    deleteFavoriteMetric(id: String!): FavoriteMetric! @requireAuth
  }
`
