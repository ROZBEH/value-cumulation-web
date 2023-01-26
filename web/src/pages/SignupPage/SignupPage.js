/**
Value Cumulation
Copyright (c) 2022 Value Cumulation

Notice: All code and information in this repository is the property of Value Cumulation.
You are strictly prohibited from distributing or using this repository unless otherwise stated.
 */

import { useRef, useState, useEffect } from 'react'

import { useForm as useSpreeForm } from '@formspree/react'
import CloseIcon from '@mui/icons-material/Close'
import DoneIcon from '@mui/icons-material/Done'
import { useForm } from 'react-hook-form'

import { useAuth } from '@redwoodjs/auth'
import {
  Form,
  Label,
  TextField,
  PasswordField,
  FieldError,
  Submit,
} from '@redwoodjs/forms'
import { Link, navigate, routes } from '@redwoodjs/router'
import { MetaTags } from '@redwoodjs/web'
import { toast, Toaster } from '@redwoodjs/web/toast'

const SignupPage = () => {
  const [_spreeState, spreeSubmit] = useSpreeForm('xvongzpq')
  const { isAuthenticated, signUp } = useAuth()

  useEffect(() => {
    if (isAuthenticated) {
      navigate(routes.home())
    }
  }, [isAuthenticated])

  // focus on email box on page load
  const usernameRef = useRef()
  useEffect(() => {
    usernameRef.current.focus()
  }, [])
  const password = useRef()
  const formMethods = useForm()
  password.current = formMethods.watch('password', '')
  const [errors, setErrors] = useState({})

  const checkErrors = (password) => {
    const length = password.length >= 8
    const uppercase = /[A-Z]/.test(password)
    const lowercase = /[a-z]/.test(password)
    const number = /[0-9]/.test(password)
    const special = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
    const whitespace = !/\s/.test(password)

    setErrors({
      length: length,
      uppercase: uppercase,
      lowercase: lowercase,
      number: number,
      special: special,
      whitespace: whitespace,
    })
  }
  const errMsg = (error) => {
    if (error === 'length') {
      return 'Password must be at least 8 characters'
    } else if (error === 'uppercase') {
      return 'Password must contain at least one uppercase letter'
    } else if (error === 'lowercase') {
      return 'Password must contain at least one lowercase letter'
    } else if (error === 'number') {
      return 'Password must contain at least one number'
    } else if (error === 'special') {
      return 'Password must contain at least one special character'
    } else if (error === 'whitespace') {
      return 'Password must not contain any whitespace'
    }
  }
  // This is a hack to clear the errors when the user deletes the password
  if ((password.current === null) & (Object.keys(errors).length > 0)) {
    setErrors({})
  }

  const onSubmit = async (data) => {
    spreeSubmit({ username: data.username, name: data.name })
    toast.loading('Signing You Up...', {
      duration: Infinity,
    })
    const response = await signUp({ ...data })
    toast.dismiss()

    if (response.message) {
      toast(response.message)
    } else if (response.error) {
      toast.error(response.error)
    } else {
      // user is signed in automatically
      toast.success('Welcome!')
    }
  }

  return (
    <>
      <MetaTags title="Signup" />

      <main className="rw-main">
        <Toaster toastOptions={{ className: 'rw-toast', duration: 6000 }} />
        <div className="rw-scaffold rw-login-container">
          <div className="rw-segment">
            <header className="rw-segment-header">
              <h2 className="rw-heading rw-heading-secondary">Signup</h2>
            </header>

            <div className="rw-segment-main">
              <div className="rw-form-wrapper">
                <Form
                  formMethods={formMethods}
                  onSubmit={onSubmit}
                  className="rw-form-wrapper"
                >
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
                      pattern: {
                        value: /[^@]+@[^.]+\..{2,}/,
                        message: 'Please enter a valid email address',
                      },
                    }}
                  />
                  <FieldError name="username" className="rw-field-error" />

                  <Label
                    name="name"
                    className="rw-label"
                    errorClassName="rw-label rw-label-error"
                  >
                    Name
                  </Label>
                  <TextField
                    name="name"
                    className="rw-input"
                    errorClassName="rw-input rw-input-error"
                    validation={{
                      required: {
                        value: true,
                        message: 'Name is required',
                      },
                    }}
                  />

                  <FieldError name="name" className="rw-field-error" />

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
                    autoComplete="new-password"
                    validation={{
                      validate: (password) => {
                        checkErrors(password)
                      },
                      required: {
                        value: true,
                        message: 'Password is required',
                      },
                    }}
                  />
                  {/* <FieldError name="password" className="rw-field-verified" /> */}
                  {/* <FieldError name="password" className="rw-field-error" /> */}
                  {Object.keys(errors).map((error, index) => {
                    let color = errors[error] ? 'green' : 'red'
                    return (
                      <div key={index}>
                        <div
                          className={
                            color == 'red'
                              ? 'rw-field-error'
                              : 'rw-field-verified'
                          }
                        >
                          {color === 'green' ? (
                            <DoneIcon style={{ color: color }} />
                          ) : (
                            <CloseIcon style={{ color: color }} />
                          )}
                          {errMsg(error)}
                        </div>
                      </div>
                    )
                  })}

                  <Label
                    className="rw-label"
                    errorClassName="rw-label rw-label-error"
                    name="password_confirm"
                  >
                    Confirm Password:
                  </Label>
                  <PasswordField
                    name="password_confirm"
                    className="rw-input"
                    errorClassName="rw-input rw-input-error"
                    autoComplete="new-password"
                    validation={{
                      required: 'You must confirm your password',
                      validate: (value) =>
                        value === password.current || 'Passwords must match',
                    }}
                  />
                  <FieldError
                    name="password_confirm"
                    className="rw-field-error"
                  />

                  <div className="rw-button-group">
                    <Submit className="rw-button rw-button-blue">
                      Sign Up
                    </Submit>
                  </div>
                </Form>
              </div>
            </div>
          </div>
          <div className="rw-login-link">
            <span>Already have an account?</span>{' '}
            <Link to={routes.login()} className="rw-link">
              Log in!
            </Link>
          </div>
        </div>
      </main>
    </>
  )
}

export default SignupPage
