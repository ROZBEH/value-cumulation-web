import { useRecoilState } from 'recoil'
import { metrics as metricsAtom } from 'src/recoil/atoms'
import './Buttons.css'

// Buttons that are visible on the main submission page
//There are more more buttons in the dropdown menu
const VisiableButtons = [
  { id: 0, title: 'Net Profit Margin', value: 'netProfitMargin' },
  { id: 1, title: 'Debt Ratio', value: 'debtRatio' },
  { id: 2, title: 'Net Income', value: 'netIncome' },
  { id: 3, title: 'Free Cash Flow', value: 'freeCashFlow' },
]

export const Mapping = () => {
  const [metrics, setMetrics] = useRecoilState(metricsAtom)
  // Update the list of available metrics as the user selects buttons
  const handleButton = (buttonValue) => {
    const tmp = [...metrics]
    if (metrics.includes(buttonValue)) {
      setMetrics(metrics.filter((el) => el !== buttonValue))
    } else {
      tmp.push(buttonValue)
      setMetrics(tmp)
    }
  }

  const buttonStyle = (value) => ({
    backgroundColor: metrics.includes(value) ? 'springgreen' : 'gainsboro',
    marginLeft: '5px',
    borderRadius: '8px',
    border: 'none',
    padding: '6px 15px',
    cursor: 'pointer',
    fontSize: '0.8rem',
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
  })

  return (
    <div className="div-btn">
      {VisiableButtons.map((bt) => (
        <button
          key={bt.id}
          onClick={() => handleButton(bt.value)}
          className={metrics.includes(bt.value) ? 'buttonPressed' : 'button'}
          value={bt.value}
          style={buttonStyle(bt.value)}
        >
          {bt.title}
        </button>
      ))}
    </div>
  )
}
