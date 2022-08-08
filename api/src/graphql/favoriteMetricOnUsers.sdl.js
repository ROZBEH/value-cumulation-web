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
  input DeleteFavoriteMetricOnUser {
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
      input: DeleteFavoriteMetricOnUser!
    ): FavoriteMetricOnUser! @skipAuth
  }
`
