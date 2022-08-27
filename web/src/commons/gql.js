export const STARTUP_QUERY = gql`
  query ($id: Int!) {
    searchbar {
      symbol
      name
      price
      exchange
      exchangeShortName
      type
    }
    user(id: $id) {
      email
      favorites {
        id
        name
      }
    }
  }
`

export const UPDATE_FAVORITES = gql`
  mutation addmetric($input: CreateFavoriteMetricInput!) {
    createFavoriteMetric(input: $input) {
      id
      name
    }
  }
`

export const DELETE_FAVORITES = gql`
  mutation removemetric($input: DeleteFavoriteMetricOnUserInput!) {
    deleteFavoriteMetricOnUser(input: $input) {
      id
    }
  }
`

export const DELETE_ALL_FAVORITES = gql`
  mutation removeALLmetric($id: Int!) {
    deleteAllFavoritesUser(id: $id) {
      id
      email
    }
  }
`

export const CREATE_CONTACT = gql`
  mutation CreateContactMutation($input: CreateContactInput!) {
    createContact(input: $input) {
      name
    }
  }
`

export const GPT_QUERY = gql`
  query ($query: String!) {
    gptIntelligence(query: $query) {
      query
      response
    }
  }
`
