/**
Value Cumulation
Copyright (c) 2022 Value Cumulation

Notice: All code and information in this repository is the property of Value Cumulation.
You are strictly prohibited from distributing or using this repository unless otherwise stated.
 */

export const STARTUP_QUERY = gql`
  query Companyslist {
    companyslist {
      symbol
      name
      price
      exchange
      exchangeShortName
      type
    }
  }
`

export const USER_QUERY = gql`
  query User($id: String!) {
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
  mutation removeALLmetric($id: String!) {
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
  query GptIntelligence($query: String!) {
    gptIntelligence(query: $query) {
      query
      response {
        symbol
        name
        price
        exchange
        exchangeShortName
        type
      }
      error
    }
  }
`

export const GPT_QUERY_SENTIMENT = gql`
  query GptSentiment($query: String!) {
    gptSentiment(query: $query) {
      query
      sentiment
    }
  }
`

export const FILTERED_COMPANIES = gql`
  query getFilteredCompaniesQuery($input: [inputMetric!]!) {
    getFilteredCompanies(input: $input) {
      ticker
      name
      metrics
      values
    }
  }
`

export const ADD_SUBSCRIPTION = gql`
  mutation createUserSubscription($input: CreateSubscriptionInput!) {
    createSubscription(input: $input) {
      subscriptionName
      price
      interval
    }
  }
`

export const SUBS_HISTORY = gql`
  query SubscriptionHistory($userId: ID!) {
    subscriptionHistory: subscriptionHistory(userId: $userId) {
      hadSubscription
      status
    }
  }
`

export const CREATE_CHECKOUT_SESSION = gql`
  mutation CreateCheckoutSession($priceId: String!, $userId: String!) {
    createCheckoutSession(priceId: $priceId, userId: $userId) {
      sessionId
      sessionUrl
    }
  }
`

export const CREATE_BILLING_PORTAL_SESSION = gql`
  mutation CreateBillingPortalSession(
    $customerId: String!
    $returnUrl: String!
  ) {
    createBillingPortalSession(customerId: $customerId, returnUrl: $returnUrl) {
      url
    }
  }
`
