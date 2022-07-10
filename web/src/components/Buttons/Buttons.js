import { useRecoilState } from 'recoil'
import { metrics } from 'src/recoil/atoms'

// Buttons that are visible on the main submission page
//There are more more buttons in the dropdown menu
const BUTTONS = [
  { id: 0, title: 'Net Profit Margin', value: 'netProfitMargin' },
  { id: 1, title: 'Debt Ratio', value: 'debtRatio' },
  { id: 3, title: 'Net Income', value: 'netIncome' },
  { id: 9, title: 'Free Cash Flow', value: 'freeCashFlow' },
]

export const Mapping = () => {
  const [metricsA, setMetrics] = useRecoilState(metrics)
  // Update the list of available metrics as the user selects buttons
  const handleButton = (buttonValue) => {
    const tmp = [...metricsA]
    if (metricsA.includes(buttonValue)) {
      setMetrics(metricsA.filter((el) => el !== buttonValue))
    } else {
      tmp.push(buttonValue)
      setMetrics(tmp)
    }
  }

  const buttonStyle = (value) => ({
    backgroundColor: metricsA.includes(value) ? 'springgreen' : 'gainsboro',
    marginLeft: '5px',
    borderRadius: '8px',
    border: 'none',
    padding: '6px 36px',
    cursor: 'pointer',
  })

  return (
    <>
      {BUTTONS.map((bt) => (
        <button
          key={bt.id}
          onClick={() => handleButton(bt.value)}
          className={metricsA.includes(bt.value) ? 'buttonPressed' : 'button'}
          value={bt.value}
          style={buttonStyle(bt.value)}
        >
          {bt.title}
        </button>
      ))}
    </>
  )
}
