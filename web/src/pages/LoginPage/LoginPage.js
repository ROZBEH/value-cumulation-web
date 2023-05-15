/**
Value Cumulation
Copyright (c) 2022 Value Cumulation

Notice: All code and information in this repository is the property of Value Cumulation.
You are strictly prohibited from distributing or using this repository unless otherwise stated.
*/

import { useEffect, useRef, useCallback } from 'react'

import { useLazyQuery } from '@apollo/client'
import { useForm as useSpreeForm } from '@formspree/react'
import { toast } from 'react-toastify'

import {
  Form,
  Label,
  TextField,
  PasswordField,
  Submit,
  FieldError,
} from '@redwoodjs/forms'
import { Link, navigate, routes } from '@redwoodjs/router'
import { MetaTags } from '@redwoodjs/web'

import { useAuth } from 'src/auth'
import { GOOGLE_LOGIN } from 'src/commons/gql'
import GoogleButton from 'src/components/GoogleButton/GoogleButton'

const LoginPage = () => {
  const [_spreeState, spreeSubmit] = useSpreeForm('xknagowb')
  const { isAuthenticated, logIn } = useAuth()
  // const { logIn: googLogIn } = useAuth('customGoogle')
  const [googleLogin] = useLazyQuery(GOOGLE_LOGIN, {
    onCompleted: (data) => {
      //pass
      // var favMetrics = data.user.favorites.map(function (fav) {
      //   return fav.name
      // })
      // setUserFavMetrics(favMetrics)
    },
  })

  // const onGoogleLogin = useCallback(
  //   (response) => {
  //     console.log('response: ', response)
  //     var idToken = response.credential

  //     // Send the id_token to the backend
  //     googleLogin({
  //       variables: { idToken: idToken },
  //     }).then((data) => {
  //       console.log('data.data: ', data.data)
  //       if (data.data.googlelogin.status === 'success') {
  //         // Login the user
  //         console.log('token: ', data.data.googlelogin.sessionToken)
  //         logIn({ token: data.data.googlelogin.sessionToken })
  //       } else {
  //         // Handle the error
  //         console.error('Google Login Error:', data.error)
  //       }
  //     })
  //   },
  //   [logIn]
  // )

  // useEffect(() => {
  //   window.onload = function () {
  //     const script = document.createElement('script')
  //     script.src = 'https://accounts.google.com/gsi/client'
  //     script.async = true
  //     script.defer = true
  //     document.body.appendChild(script)
  //   }
  //   window.handleCredentialResponse = onGoogleLogin
  // }, [onGoogleLogin])

  useEffect(() => {
    if (isAuthenticated) {
      navigate(routes.home())
    }
  }, [isAuthenticated])

  const usernameRef = useRef()
  useEffect(() => {
    usernameRef.current.focus()
  }, [])

  const onSubmit = async (data) => {
    console.log('data: ', data)
    spreeSubmit({ username: data.username })
    toast.loading('Logging You in...', {
      duration: Infinity,
    })
    const { username, password } = data
    // const response = await logIn({ username, password, method: 'email' })
    const response = await logIn({ id: 'cus_NssOD0je7EFzF2', method: 'email' })

    toast.dismiss()

    if (response.message) {
      toast(response.message)
    } else if (response.error) {
      toast.error(response.error)
    } else {
      toast.success('Welcome back!')
    }
  }

  return (
    <>
      <MetaTags title="Login" />
      <main className="rw-main">
        <div className="rw-scaffold rw-login-container">
          <div className="rw-segment">
            <header className="rw-segment-header">
              <h2 className="rw-heading rw-heading-secondary">Login</h2>
            </header>

            <div className="rw-segment-main">
              <div className="rw-form-wrapper">
                <Form onSubmit={onSubmit} className="rw-form-wrapper">
                  <Label
                    name="username"
                    className="rw-label"
                    errorClassName="rw-label rw-label-error"
                  >
                    Email
                  </Label>
                  <TextField
                    name="username"
                    className="rw-input"
                    errorClassName="rw-input rw-input-error"
                    ref={usernameRef}
                    validation={{
                      required: {
                        value: true,
                        message: 'Username is required',
                      },
                    }}
                  />

                  <FieldError name="username" className="rw-field-error" />

                  <Label
                    name="password"
                    className="rw-label"
                    errorClassName="rw-label rw-label-error"
                  >
                    Password
                  </Label>
                  <PasswordField
                    name="password"
                    className="rw-input"
                    errorClassName="rw-input rw-input-error"
                    autoComplete="current-password"
                    validation={{
                      required: {
                        value: true,
                        message: 'Password is required',
                      },
                    }}
                  />

                  <div className="rw-forgot-link">
                    <Link
                      to={routes.forgotPassword()}
                      className="rw-forgot-link"
                    >
                      Forgot Password?
                    </Link>
                  </div>

                  <FieldError name="password" className="rw-field-error" />

                  <div className="rw-button-group">
                    <Submit className="rw-button rw-button-blue">Login</Submit>
                  </div>
                </Form>
              </div>
            </div>
          </div>
          <div className="rw-login-link">
            <span>Don&apos;t have an account?</span>{' '}
            <Link to={routes.signup()} className="rw-link">
              Sign up!
            </Link>
          </div>
          <div className="g_id_signin" data-type="standard"></div>
          <GoogleButton />
          <div
            id="g_id_onload"
            data-client_id="345100971561-6m6ftaqa4fn9ls6cg3m6akinkfjl55sa.apps.googleusercontent.com"
            data-callback="handleCredentialResponse"
          ></div>
        </div>
      </main>
    </>
  )
}

export default LoginPage
