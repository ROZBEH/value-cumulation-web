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
    favoriteMetrics: [FavoriteMetric!]! @skipAuth
    favoriteMetric(id: String!): FavoriteMetric @skipAuth
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
      @skipAuth
    updateFavoriteMetric(
      id: String!
      input: UpdateFavoriteMetricInput!
    ): FavoriteMetric! @skipAuth
    deleteFavoriteMetric(id: String!): FavoriteMetric! @skipAuth
  }
`
