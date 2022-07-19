import { MetaTags } from '@redwoodjs/web'
import {
  FieldError,
  Form,
  Label,
  TextField,
  TextAreaField,
  Submit,
} from '@redwoodjs/forms'

// import './ContactPage.css'
const ContactPage = () => {
  const onSubmit = (data) => {
    console.log(data)
  }

  return (
    <>
      <MetaTags title="Contact" description="Contact page" />

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          margin: '4rem auto',
          // display: 'block',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Form onSubmit={onSubmit} config={{ mode: 'onBlur' }}>
          <Label name="name" errorClassName="error">
            Name
          </Label>
          <TextField
            name="name"
            validation={{ required: true }}
            errorClassName="error"
          />
          <FieldError name="name" className="error" />

          <Label name="email" errorClassName="error">
            Email
          </Label>
          <TextField
            name="email"
            validation={{
              required: true,
              pattern: {
                value: /^[^@]+@[^.]+\..+$/,
                message: 'Please enter a valid email address',
              },
            }}
            errorClassName="error"
          />
          <FieldError name="email" className="error" />

          <Label name="message" errorClassName="error">
            Message
          </Label>
          <TextAreaField
            name="message"
            validation={{ required: true }}
            errorClassName="error"
          />
          <FieldError name="message" className="error" />

          <Submit>Save</Submit>
        </Form>
      </div>
    </>
  )
}

export default ContactPage
