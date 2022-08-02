export const schema = gql`
  type FavoriteMetric {
    id: Int!
    name: String!
    users: [FavoriteMetricOnUser]!
  }

  type Query {
    favoriteMetrics: [FavoriteMetric!]! @requireAuth
    favoriteMetric(id: Int!): FavoriteMetric @requireAuth
  }

  input CreateFavoriteMetricInput {
    name: String!
  }

  input UpdateFavoriteMetricInput {
    name: String
  }

  type Mutation {
    createFavoriteMetric(input: CreateFavoriteMetricInput!): FavoriteMetric!
      @requireAuth
    updateFavoriteMetric(
      id: Int!
      input: UpdateFavoriteMetricInput!
    ): FavoriteMetric! @requireAuth
    deleteFavoriteMetric(id: Int!): FavoriteMetric! @requireAuth
  }
`
