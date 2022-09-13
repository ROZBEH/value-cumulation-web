export const STARTUP_QUERY = gql`
  query ($id: Int!) {
    companyslist {
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

export const COMPANY_QUERY = gql`
  query GetFundamentalQuery($ticker: String!) {
    getFundamentals(ticker: $ticker) {
      companyName
      metricNames
      fullMetricNames
      metricValues
      metricsDescription
      secReports {
        symbol
        fillingDate
        acceptedDate
        cik
        type
        link
        finalLink
      }
      years
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

export const GPT_QUERY_SECTOR = gql`
  query ($query: String!) {
    gptIntelligence(query: $query) {
      query
      response
    }
  }
`

export const GPT_QUERY_SENTIMENT = gql`
  query ($query: String!) {
    gptSentiment(query: $query) {
      query
      sentiment
    }
  }
`
