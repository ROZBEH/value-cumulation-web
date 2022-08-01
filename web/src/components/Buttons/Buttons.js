import { useRecoilState } from 'recoil'
import {
  metrics as metricsAtom,
  userFavMetrics as userFavMetricsAtom,
} from 'src/recoil/atoms'
import { Tooltip } from '@material-ui/core'
import { Favorite } from '@material-ui/icons'
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
  const [favoriteMetrics, setFavoriteMetrics] =
    useRecoilState(userFavMetricsAtom)
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
  const favIconOnClick = (event, option) => {
    var tmp = [...favoriteMetrics]
    if (!tmp.includes(option.value)) {
      tmp.push(option.value)
      setFavoriteMetrics(tmp)
    } else {
      setFavoriteMetrics(tmp.filter((el) => el !== option.value))
    }
  }

  return (
    <div className="div-btn">
      {VisiableButtons.map((bt) => (
        <div key={bt.id} className="flex items-center">
          <button
            className={`text-red-700 text-xs pl-1.5 rounded-l-lg h-9 cursor-pointer ${
              metrics.includes(bt.value) ? 'bg-springgreen' : 'bg-gainsboro'
            } `}
          >
            <Tooltip title="Add to Favorite">
              <Favorite
                onClick={(e) => favIconOnClick(e, bt)}
                className={`${
                  favoriteMetrics.includes(bt.value)
                    ? 'text-red-700'
                    : 'text-gray-400'
                }`}
                fontSize="medium"
              />
            </Tooltip>
          </button>
          <button
            onClick={() => handleButton(bt.value)}
            className={`text-xs pl-1.5 mr-2.5 pr-1.5 rounded-r-lg h-9 cursor-pointer ${
              metrics.includes(bt.value) ? 'bg-springgreen' : 'bg-gainsboro'
            } `}
            value={bt.value}
          >
            {bt.title}
          </button>
        </div>
      ))}
    </div>
  )
}
