import { MetaTags, useMutation } from '@redwoodjs/web'
import {
  FieldError,
  Form,
  Label,
  TextField,
  TextAreaField,
  Submit,
} from '@redwoodjs/forms'
import { useAuth } from '@redwoodjs/auth'
import { useRef } from 'react'
import { toast, Toaster } from '@redwoodjs/web/toast'
import { useEffect } from 'react'
const CREATE_CONTACT = gql`
  mutation CreateContactMutation($input: CreateContactInput!) {
    createContact(input: $input) {
      id
    }
  }
`
const ContactPage = () => {
  let contactName
  const [create, { loading, _error }] = useMutation(CREATE_CONTACT, {
    onCompleted: () => {
      toast.success(`Thank you for your submission ${contactName}!`)
    },
  })
  const onSubmit = (data) => {
    contactName = data.name
    create({ variables: { input: data } })
  }

  return (
    <>
      <MetaTags title="Contact" description="Contact page" />

      <main className="rw-main">
        <Toaster toastOptions={{ className: 'rw-toast', duration: 6000 }} />
        <div className="rw-scaffold rw-login-container">
          <div className="rw-segment">
            <header className="rw-segment-header">
              <h2 className="rw-heading rw-heading-secondary">Contact us</h2>
            </header>

            <div className="rw-segment-main">
              <div className="rw-form-wrapper">
                <Form
                  config={{ mode: 'onBlur' }}
                  onSubmit={onSubmit}
                  className="rw-form-wrapper"
                >
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
                    name="email"
                    className="rw-label"
                    errorClassName="rw-label rw-label-error"
                  >
                    Email
                  </Label>
                  <TextField
                    name="email"
                    className="rw-input"
                    errorClassName="rw-input rw-input-error"
                    validation={{
                      required: true,
                      pattern: {
                        value: /^[^@]+@[^.]+\..+$/,
                        message: 'Please enter a valid email address',
                      },
                    }}
                  />
                  <FieldError name="email" className="rw-field-error" />

                  <Label
                    name="message"
                    className="rw-label"
                    errorClassName="rw-label rw-label-error"
                  >
                    Message
                  </Label>
                  <TextAreaField
                    name="message"
                    className="rw-input"
                    errorClassName="rw-input rw-input-error"
                    validation={{
                      required: {
                        value: true,
                        message: 'Message is required',
                      },
                    }}
                  />
                  <FieldError name="message" className="rw-field-error" />

                  <div className="rw-button-group">
                    <Submit
                      disabled={loading}
                      className="rw-button rw-button-blue"
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

export default ContactPage
