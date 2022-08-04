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

  type Mutation {
    createFavoriteMetricOnUser(
      input: CreateFavoriteMetricOnUserInput!
    ): FavoriteMetricOnUser! @skipAuth
    updateFavoriteMetricOnUser(
      id: Int!
      input: UpdateFavoriteMetricOnUserInput!
    ): FavoriteMetricOnUser! @skipAuth
    deleteFavoriteMetricOnUser(id: Int!): FavoriteMetricOnUser! @skipAuth
  }
`
