import {
  Form,
  TextField,
  TextAreaField,
  Submit,
  Label,
  FieldError,
  useForm,
  FormError,
} from '@redwoodjs/forms'
import { useMutation } from '@redwoodjs/web'
import './Mainsubmission.css'
export const Mainsubmission = ({ pickTicker }) => {
  const formMethods = useForm({ mode: 'onBlur' })
  const onSubmit = (data) => {
    formMethods.reset()
    pickTicker(data)
  }

  return (
    <>
      <Form
        formMethods={formMethods}
        // error={error}
        onSubmit={onSubmit}
        style={{ fontSize: '2rem' }}
      >
        <TextField name="ticker" placeholder="Stock Ticker" maxLength="10" />
        <Submit>Go</Submit>
      </Form>
    </>
  )
}
