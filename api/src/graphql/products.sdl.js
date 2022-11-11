/**
Value Cumulation
Copyright (c) 2022 Value Cumulation

Notice: All code and information in this repository is the property of Value Cumulation.
You are strictly prohibited from distributing or using this repository unless otherwise stated.
 */
export const schema = gql`
  scalar URL

  type Product {
    id: ID!
    name: String!
    image: String
    description: String
    price: Int!
    type: String!
  }

  enum ProductType {
    one_time
    recurring
  }

  type Query {
    products(type: ProductType): [Product!]! @skipAuth
  }
`
