import { Form, TextField, Submit, useForm } from '@redwoodjs/forms'
import { ticker as tickerA, name as nameA } from 'src/recoil/atoms'
import { useRecoilState } from 'recoil'
import './Mainsubmission.css'
export const Mainsubmission = () => {
  const [, setTicker] = useRecoilState(tickerA)
  const [, setName] = useRecoilState(nameA)
  const formMethods = useForm({ mode: 'onBlur' })
  const submitTicker = (data) => {
    formMethods.reset()
    setTicker(data.ticker)
    setName('')
  }

  return (
    <>
      <Form
        formMethods={formMethods}
        // error={error}
        onSubmit={submitTicker}
        style={{ fontSize: '2rem' }}
      >
        <TextField name="ticker" placeholder="Stock Ticker" maxLength="10" />
        <Submit>Go</Submit>
      </Form>
    </>
  )
}
