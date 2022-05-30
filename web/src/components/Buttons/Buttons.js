import { useState, useEffect } from 'react'
const BUTTONS = [
  { id: 0, title: 'Net Profit Margin', value: 'netProfitMargin' },
  { id: 1, title: 'Debt Ratio', value: 'debtRatio' },
  { id: 2, title: 'Burn Ratio', value: 'burnRatio' },
  { id: 3, title: 'Net Income', value: 'netIncome' },
  { id: 3, title: 'Free Cash Flow', value: 'freeCashFlow' },
]
export const Mapping = ({ metrics }) => {
  const [values, setValues] = useState(['netIncome'])
  const handleButton = (buttonValue) => {
    const tmp = [...values]
    if (values.includes(buttonValue)) {
      setValues(values.filter((el) => el !== buttonValue))
    } else {
      tmp.push(buttonValue)
      setValues(tmp)
    }
  }
  useEffect(() => {
    metrics(values)
  }, [metrics, values])

  return (
    <>
      {BUTTONS.map((bt) => (
        <button
          key={bt.id}
          onClick={() => handleButton(bt.value)}
          className={values.includes(bt.value) ? 'buttonPressed' : 'button'}
          value={bt.value}
          style={{
            backgroundColor: values.includes(bt.value)
              ? 'springgreen'
              : 'gainsboro',
          }}
        >
          {bt.title}
        </button>
      ))}
    </>
  )
}
