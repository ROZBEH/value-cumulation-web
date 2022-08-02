export const schema = gql`
  type FavoriteMetricOnUser {
    id: Int!
    favoriteMetricId: Int!
    favoriteMetric: FavoriteMetric!
    userId: Int!
    user: User!
  }

  type Query {
    favoriteMetricOnUsers: [FavoriteMetricOnUser!]! @requireAuth
    favoriteMetricOnUser(id: Int!): FavoriteMetricOnUser @requireAuth
  }

  input CreateFavoriteMetricOnUserInput {
    favoriteMetricId: Int!
    userId: Int!
  }

  input UpdateFavoriteMetricOnUserInput {
    favoriteMetricId: Int
    userId: Int
  }

  type Mutation {
    createFavoriteMetricOnUser(
      input: CreateFavoriteMetricOnUserInput!
    ): FavoriteMetricOnUser! @requireAuth
    updateFavoriteMetricOnUser(
      id: Int!
      input: UpdateFavoriteMetricOnUserInput!
    ): FavoriteMetricOnUser! @requireAuth
    deleteFavoriteMetricOnUser(id: Int!): FavoriteMetricOnUser! @requireAuth
  }
`
