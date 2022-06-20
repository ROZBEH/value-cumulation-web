import { Form, TextField, Submit, useForm } from '@redwoodjs/forms'
import {
  ticker as tickerA,
  name as nameA,
  counterCompany as counterCompanyA,
} from 'src/recoil/atoms'
import { useRecoilState } from 'recoil'
import './Mainsubmission.css'
export const Mainsubmission = () => {
  const [, setTicker] = useRecoilState(tickerA)
  const [, setName] = useRecoilState(nameA)
  const [counterCompany, setCounterCompany] = useRecoilState(counterCompanyA)
  const formMethods = useForm({ mode: 'onBlur' })
  const submitTicker = (data) => {
    formMethods.reset()
    setTicker(Object.values(data))
    setName('')
  }
  let counterArr = new Array(counterCompany).fill('').map((_, i) => i + 1)
  const increaseCounter = () => {
    setCounterCompany(counterCompany + 1)
    counterArr = new Array(counterCompany).fill('').map((_, i) => i + 1)
  }
  const decreaseCounter = () => {
    if (counterCompany > 1) {
      setCounterCompany(counterCompany - 1)
      counterArr = new Array(counterCompany).fill('').map((_, i) => i + 1)
    }
  }

  return (
    <>
      <Form
        formMethods={formMethods}
        // error={error}
        onSubmit={submitTicker}
        style={{ fontSize: '2rem' }}
      >
        {counterArr.map((item, index) => (
          <TextField
            key={index}
            name={'ticker' + item}
            placeholder="Stock Ticker"
            maxLength="10"
          />
        ))}
        <Submit>Go</Submit>
      </Form>
      <button name="comparisonMode" onClick={increaseCounter}>
        {' '}
        Add Company
      </button>
      <button name="comparisonMode" onClick={decreaseCounter}>
        {' '}
        Remove Company
      </button>
    </>
  )
}
