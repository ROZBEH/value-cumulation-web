/**
Value Cumulation
Copyright (c) 2022 Value Cumulation

Notice: All code and information in this repository is the property of Value Cumulation.
You are strictly prohibited from distributing or using this repository unless otherwise stated.
 */

export const schema = gql`
  type Result {
    status: String!
    sessionToken: String!
  }

  type Query {
    googlelogin(idToken: String!): Result! @skipAuth
  }
`
