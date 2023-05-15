import { toast } from '@redwoodjs/web/toast'

import { randomStr } from 'src/components/GoogleButton/utils/randomStr'

const GOOGLE_STATE_LENGTH = 40
const GOOGLE_STATE_STORAGE_KEY = 'google.state'
const GOOGLE_PROVIDER_STORAGE_KEY = 'google.provider'
const GOOGLE_REDIRECT_URL = process.env.GRANT_PAGE_URL

export const GoogleProviders = ['google']
const GoogleData = {
  google: {
    client_id: process.env.GOOGLE_CLIENT_ID,
    scope: process.env.GOOGLE_SCOPE,
    url: process.env.GOOGLE_AUTH2_URL,
  },
}

export const requestGoogle = (provider) => () => {
  if (!GoogleProviders.includes(provider)) {
    toast.error(`The ${provider} provider is not supported.`)
    return
  }

  window.sessionStorage.setItem(GOOGLE_PROVIDER_STORAGE_KEY, provider)

  const state = randomStr(GOOGLE_STATE_LENGTH)
  window.sessionStorage.setItem(GOOGLE_STATE_STORAGE_KEY, state)

  const data = GoogleData[provider]

  const url = `${data.url}?client_id=${data.client_id}&\
redirect_uri=${GOOGLE_REDIRECT_URL}&\
response_type=token&\
scope=${data.scope}&\
state=${state}`
  console.log('url: ', url)

  const width = 600
  const height = 600
  const left = (window.screen.width - width) / 2
  const top = (window.screen.height - height) / 2

  window.open(
    url,
    'Google Authorization Grant',
    `width=${width},height=${height},left=${left},top=${top}`
  )
  // window.location.href = url
}

export const handleGoogle = async (response) => {
  console.log('inside handleGoogle: ', response)
  const code = response.code
  const state = response.state

  if (!code) throw new Error('An authorization grant code is required.')
  if (!state) throw new Error('A state parameter is required.')

  const provider = window.sessionStorage.getItem(GOOGLE_PROVIDER_STORAGE_KEY)

  const storedState = window.sessionStorage.getItem(GOOGLE_STATE_STORAGE_KEY)

  console.log('provider: ', provider)
  console.log('storedState: ', storedState)

  // if (!provider || !GoogleProviders.includes(provider))
  //   throw new Error('Could not retrieve stored Google provider.')

  // if (!state)
  //   throw new Error('Could not retrieve stored Google state parameter.')

  // if (state !== storedState)
  //   throw new Error('Could not validate Google state parameter.')

  // setTimeout(() => {
  //   const url = new URL(window.opener.location.href)
  //   const redirectTo = url.searchParams.get('redirectTo') || url.href
  //   console.log('redirectTo: ', redirectTo)
  //   window.opener.location.href = redirectTo

  //   window.close()
  // }, 5000)
  const url = new URL(window.opener.location.href)
  const redirectTo = url.searchParams.get('redirectTo') || url.href
  console.log('redirectTo: ', redirectTo)

  const responseNetlify = await fetch(
    'http://localhost:8911/.netlify/functions/auth',
    {
      method: 'POST',
      cors: 'no-cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'rouzbeh.asghari@gmail.com',
        password: '123qwe!@#QWE',
      }),
    }
  )

  console.log('responseNetlify: ', responseNetlify)

  if (window.opener) {
    // This code will run in the popup window
    // Redirect the original window
    window.opener.location.href = redirectTo
    // Close the popup window
    window.close()
  } else {
    // This code will run in the original window
    window.location.href = redirectTo
  }
}
