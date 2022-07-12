import { useRecoilState } from 'recoil'
import { metrics as metricsAtom } from 'src/recoil/atoms'

// Buttons that are visible on the main submission page
//There are more more buttons in the dropdown menu
const VisiableButtons = [
  { id: 0, title: 'Net Profit Margin', value: 'netProfitMargin' },
  { id: 1, title: 'Debt Ratio', value: 'debtRatio' },
  { id: 3, title: 'Net Income', value: 'netIncome' },
  { id: 9, title: 'Free Cash Flow', value: 'freeCashFlow' },
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
    padding: '6px 36px',
    cursor: 'pointer',
  })

  const divButtonStyle = {
    display: 'flex',
    marginBottom: '60px',
    marginTop: '20px',
    // float: 'left',
  }

  return (
    <div style={divButtonStyle}>
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
