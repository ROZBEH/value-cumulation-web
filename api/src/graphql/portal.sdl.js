export const schema = gql`
  type Session {
    id: String!
    url: String!
  }

  type SubHistory {
    hadSubscription: Boolean!
  }

  type Query {
    subscriptionHistory(userId: ID!): SubHistory! @requireAuth
  }

  type Mutation {
    # In GraphQL, we can't reuse types as mutation inputs
    portal(userId: ID!): Session! @requireAuth
  }
`
