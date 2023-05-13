import { useEffect } from 'react'

import { MetaTags } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

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

const GrantPage = (props) => {
  const { code, error, errorDescription, state } = props

  useEffect(() => {
    if (error) {
      switch (error) {
        case 'access_denied': {
          const timeout = setTimeout(() => window.close(), 5000)
          return () => clearTimeout(timeout)
        }

        default: {
          errorDescription && toast.error(errorDescription)
          return
        }
      }
    }

    toast.promise(handleGoogle({ code, state }), {
      error: (err) => err.message,
      loading: "Logging you in using the provider's OAuth access code.",
      success: 'Successfully logged in. This page will close in 5s.',
    })
  }, [code, error, errorDescription, state])

  return (
    <>
      <MetaTags title="OAuth Confirmation" />
      {!error && <div className="card">Successfully</div>}
      <div className="card">
        <div className="auth-card-body">
          <header className="auth-header mb-0">
            <h2>{getTitle(error)}</h2>
            {error && <p>This page should close in 5 seconds.</p>}
            {!error && (
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
