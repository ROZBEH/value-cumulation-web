/**
Value Cumulation
Copyright (c) 2022 Value Cumulation

Notice: All code and information in this repository is the property of Value Cumulation.
You are strictly prohibited from distributing or using this repository unless otherwise stated.
 */

import { useEffect, useRef, useState } from 'react'

import CloseIcon from '@mui/icons-material/Close'
import DoneIcon from '@mui/icons-material/Done'
import { useForm } from 'react-hook-form'

import { useAuth } from '@redwoodjs/auth'
import {
  Form,
  Label,
  PasswordField,
  Submit,
  FieldError,
} from '@redwoodjs/forms'
import { navigate, routes } from '@redwoodjs/router'
import { MetaTags } from '@redwoodjs/web'
import { toast, Toaster } from '@redwoodjs/web/toast'

const ResetPasswordPage = ({ resetToken }) => {
  const { isAuthenticated, reauthenticate, validateResetToken, resetPassword } =
    useAuth()
  const [enabled, setEnabled] = useState(true)

  useEffect(() => {
    if (isAuthenticated) {
      navigate(routes.home())
    }
  }, [isAuthenticated])

  useEffect(() => {
    const validateToken = async () => {
      const response = await validateResetToken(resetToken)
      if (response.error) {
        setEnabled(false)
        toast.error(response.error)
      } else {
        setEnabled(true)
      }
    }
    validateToken()
  }, [resetToken, validateResetToken])

  // const passwordRef = useRef()
  // useEffect(() => {
  //   passwordRef.current.focus()
  // }, [])

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
      return 'Password must contain at least one special character (!@#$%^()&*)'
    } else if (error === 'whitespace') {
      return 'Password must not contain any whitespace'
    }
  }
  // This is a hack to clear the errors when the user deletes the password
  const password = useRef()
  const formMethods = useForm()
  password.current = formMethods.watch('password', '')
  if ((password.current === null) & (Object.keys(errors).length > 0)) {
    setErrors({})
  }

  const onSubmit = async (data) => {
    // Making sure there is no errors
    if (Object.values(errors).every((item) => item) !== true) {
      toast.error('Password must meet all requirements')
      return
    }
    const response = await resetPassword({
      resetToken,
      password: data.password,
    })

    if (response.error) {
      toast.error(response.error)
    } else {
      setErrors({})
      toast.success('Password changed!')
      await reauthenticate()
      navigate(routes.login())
    }
  }

  return (
    <>
      <MetaTags title="Reset Password" />

      <main className="rw-main">
        <Toaster toastOptions={{ className: 'rw-toast', duration: 6000 }} />
        <div className="rw-scaffold rw-login-container">
          <div className="rw-segment">
            <header className="rw-segment-header">
              <h2 className="rw-heading rw-heading-secondary">
                Reset Password
              </h2>
            </header>

            <div className="rw-segment-main">
              <div className="rw-form-wrapper">
                <Form
                  formMethods={formMethods}
                  onSubmit={onSubmit}
                  className="rw-form-wrapper"
                >
                  <div className="text-left">
                    <Label
                      name="password"
                      className="rw-label"
                      errorClassName="rw-label rw-label-error"
                    >
                      New Password
                    </Label>
                    <PasswordField
                      name="password"
                      autoComplete="new-password"
                      className="rw-input"
                      errorClassName="rw-input rw-input-error"
                      disabled={!enabled}
                      onChange={(e) => {
                        checkErrors(e.target.value)
                      }}
                      // ref={passwordRef}
                      validation={{
                        // validate: (password) => {
                        //   checkErrors(password)
                        // },
                        required: {
                          value: true,
                          message: 'Password is required',
                        },
                      }}
                    />
                    {Object.keys(errors).map((error, index) => {
                      let color = errors[error] ? 'green' : 'red'
                      return (
                        <div
                          key={index}
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
                      )
                    })}

                    <FieldError name="password" className="rw-field-error" />
                  </div>

                  <div className="rw-button-group">
                    <Submit
                      className="rw-button rw-button-blue"
                      disabled={!enabled}
                    >
                      Submit
                    </Submit>
                  </div>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

export default ResetPasswordPage
