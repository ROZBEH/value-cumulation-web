export const schema = gql`
  type FavoriteMetric {
    id: Int!
    name: String!
  }

  type Query {
    favoriteMetrics: [FavoriteMetric!]! @skipAuth
    favoriteMetric(id: Int!): FavoriteMetric @skipAuth
  }

  input CreateFavoriteMetricInput {
    name: String!
    userId: Int!
  }

  input UpdateFavoriteMetricInput {
    name: String
  }

  type Mutation {
    createFavoriteMetric(input: CreateFavoriteMetricInput!): FavoriteMetric!
      @skipAuth
    updateFavoriteMetric(
      id: Int!
      input: UpdateFavoriteMetricInput!
    ): FavoriteMetric! @skipAuth
    deleteFavoriteMetric(id: Int!): FavoriteMetric! @skipAuth
  }
`
