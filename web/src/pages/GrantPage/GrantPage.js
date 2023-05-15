import { useEffect, useRef } from 'react'

import { useLocation } from '@redwoodjs/router'
import { MetaTags } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { useAuth } from 'src/auth'
import { handleGoogle } from 'src/components/GoogleButton/utils/google'

const getTitle = (error) => {
  if (!error) return 'Google Access Granted'

  switch (error) {
    case 'access_denied':
      return 'Google Grant Rejected'

    default:
      return 'Google Grant Error'
  }
}

const GrantPage = () => {
  const location = useLocation()
  // useRef to store error
  const error = useRef(null)
  const { logIn } = useAuth()

  useEffect(() => {
    const fragmentParams = new URLSearchParams(location.hash.substring(1))
    const code = fragmentParams.get('access_token')
    const state = fragmentParams.get('state')
    // error = fragmentParams.get('error')
    error.current = fragmentParams.get('error')
    console.log('error: ', error)
    console.log('code: ', code)
    console.log('state: ', state)

    if (!code) {
      throw new Error('An authorization grant code is required.')
    }

    if (!state) {
      throw new Error('A state parameter is required.')
    }

    // Handle the response and perform necessary actions
    toast
      .promise(handleGoogle({ code, state }), {
        error: (err) => err.message,
        loading: "Logging you in using the provider's OAuth access code.",
        success: 'Successfully logged in. This page will close in 5s.',
      })
      .finally(() => {
        // Close the grant page after some time or perform other actions if needed
        setTimeout(() => {
          window.close()
        }, 10000)
      })
  }, [location.hash])

  return (
    <>
      <MetaTags title="OAuth Confirmation" />
      {!error.current && <div className="card">Successfully</div>}
      <div className="card">
        <div className="auth-card-body">
          <header className="auth-header mb-0">
            <h2>{getTitle(error.current)}</h2>
            {error.current && <p>This page should close in 5 seconds.</p>}
            {!error.current && (
              <p>
                Our request to log you in using a third-party provider was
                accepted.
              </p>
            )}
          </header>
        </div>
      </div>
    </>
  )
}

export default GrantPage
