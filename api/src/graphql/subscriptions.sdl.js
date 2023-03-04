export const schema = gql`
  type Subscription {
    id: String!
    subscriptionName: String!
    price: Float!
    interval: Interval!
    # users: [User]!
    createdAt: DateTime!
  }

  enum Interval {
    MONTHLY
    YEARLY
    QUARTERLY
    WEEKLY
  }

  type Query {
    subscriptions: [Subscription!]! @requireAuth
    subscription(id: String!): Subscription @requireAuth
  }

  input CreateSubscriptionInput {
    subscriptionName: String!
    price: Float!
    interval: Interval!
    userId: String!
  }

  input UpdateSubscriptionInput {
    subscriptionName: String
    price: Float
    interval: Interval
  }

  type Mutation {
    createSubscription(input: CreateSubscriptionInput!): Subscription!
      @requireAuth
    updateSubscription(
      id: String!
      input: UpdateSubscriptionInput!
    ): Subscription! @requireAuth
    deleteSubscription(id: String!): Subscription! @requireAuth
  }
`
