/**
Value Cumulation
Copyright (c) 2022 Value Cumulation

Notice: All code and information in this repository is the property of Value Cumulation.
You are strictly prohibited from distributing or using this repository unless otherwise stated.
 */
export const schema = gql`
  type Session {
    id: String!
    url: String!
  }

  type SubHistory {
    hadSubscription: Boolean!
  }

  type Query {
    subscriptionHistory(userId: ID!): SubHistory! @skipAuth
  }

  type Mutation {
    # In GraphQL, we can't reuse types as mutation inputs
    portal(userId: ID!): Session! @requireAuth
  }
`
