/**
Value Cumulation
Copyright (c) 2022 Value Cumulation

Notice: All code and information in this repository is the property of Value Cumulation.
You are strictly prohibited from distributing or using this repository unless otherwise stated.
 */
export const schema = gql`
  type StripeSession {
    sessionId: String!
  }

  type BillingPortalSession {
    url: String!
  }

  type Session {
    id: String!
    customerId: String
    customerEmail: String
    customerName: String
    customerSignedUp: Boolean
  }

  enum Mode {
    payment
    subscription
  }

  input ProductInput {
    id: ID!
    quantity: Int!
  }

  type Query {
    getSession(id: ID!): Session! @requireAuth
  }

  type Mutation {
    # In GraphQL, we can't reuse types as mutation inputs
    # (otherwise we'd just type "cart" as "[Product!]!")
    checkout(mode: Mode!, cart: [ProductInput!]!, customerId: String): Session!
      @requireAuth
    createCheckoutSession(priceId: String!, userId: String!): StripeSession!
      @requireAuth
    createBillingPortalSession(
      customerId: String!
      returnUrl: String!
    ): BillingPortalSession! @requireAuth
  }
`
