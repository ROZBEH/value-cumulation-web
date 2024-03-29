/**
Value Cumulation
Copyright (c) 2022 Value Cumulation

Notice: All code and information in this repository is the property of Value Cumulation.
You are strictly prohibited from distributing or using this repository unless otherwise stated.
 */

export const schema = gql`
  type Contact {
    id: Int!
    name: String!
    email: String!
    message: String!
    createdAt: DateTime!
  }

  type Query {
    contacts: [Contact!]! @skipAuth
    contact(id: Int!): Contact @skipAuth
  }

  input CreateContactInput {
    name: String!
    email: String!
    message: String!
  }

  input UpdateContactInput {
    name: String
    email: String
    message: String
  }

  type Mutation {
    createContact(input: CreateContactInput!): Contact! @skipAuth
    # We're not going to let anyone update or delete a message, so we can
    # remove those fields completely. Here's what the SDL file looks like after
    # the changes:
    # updateContact(id: Int!, input: UpdateContactInput!): Contact! @requireAuth
    # deleteContact(id: Int!): Contact! @requireAuth
  }
`
