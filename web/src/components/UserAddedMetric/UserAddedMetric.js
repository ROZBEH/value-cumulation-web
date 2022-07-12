import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'
import { makeStyles } from '@mui/styles'
import Chip from '@material-ui/core/Chip'
import classNames from 'classnames'
import { metrics as metricsAtom } from 'src/recoil/atoms'
import { useRecoilState } from 'recoil'

export const UserAddedMetric = () => {
  const [metricsA, setMetrics] = useRecoilState(metricsAtom)
  // List of available metrics for now. This list will be updated as we
  // decide on the list of metrics to be shown to the user.
  const availableOptions = [
    {
      id: 0,
      title: 'Market Cap Change With Retained Earnings',
      value: 'marketCapChangeWithRetainedEarnings',
    },
    { id: 1, title: 'Gross Profit Margin', value: 'grossProfitMargin' },
    { id: 2, title: 'Burn Ratio', value: 'burnRatio' },
    { id: 3, title: 'Price To Earning', value: 'priceToEarning' },
    { id: 4, title: 'R & D Budget To Revenue', value: 'rAndDBudgetToRevenue' },
    { id: 5, title: 'Current Ratio', value: 'currentRatio' },
    {
      id: 6,
      title: 'Price to Free Cash Flow',
      value: 'priceToFreeCashFlowsRatio',
    },
    { id: 7, title: 'Operating Cash Flow', value: 'operatingCashFlow' },
    {
      id: 8,
      title: 'Free Cash Flow to Net Income',
      value: 'freeCashFlowToNetIncome',
    },
    {
      id: 9,
      title: 'Operating Cash Flow to Current Liabilities',
      value: 'operatingCFToCurrentLiabilities',
    },
    { id: 10, title: 'Dividend Yield', value: 'dividendYield' },
    {
      id: 11,
      title: 'Income Tax to Net Income',
      value: 'incomeTaxToNetIncome',
    },
    {
      id: 12,
      title: 'Return on Retained Earning',
      value: 'returnOnRetainedEarnings',
    },
    {
      id: 13,
      title: 'Market Cap Change with Retained Earning',
      value: 'marketCapChangeWithRetainedEarnings',
    },
    {
      id: 14,
      title: 'Mean Net Income Growth Rate',
      value: 'meanNetIncomeGrowthRate',
    },
    {
      id: 15,
      title: 'Mean Free Cash Flow Growth Rate',
      value: 'meanFCFGrowthRate',
    },
    { id: 16, title: 'Intrinsic Value', value: 'intrinsicValue' },
  ]

  const txtBoxStyle = {
    width: '50%',
    marginBottom: '1rem',
  }

  const autoCompStyle = {
    width: '60%',
    // marginBottom: '2rem',
    // marginTop: '2rem',
    marginBottom: '20px',
    marginTop: '10px',
    marginLeft: '10px',
    // float: 'left',
  }

  const myChangeFunc = (_event, values, reason, detail) => {
    var tmp = [...metricsA]
    // If the user has selected a metric, then add that metric to the list of metrics
    // that will be plotted. And if the user has removed a metric(removeOption),
    // then remove the metric from the list of available metrics
    if (reason === 'removeOption') {
      tmp = tmp.filter(function (item) {
        return item !== detail.option.value
      })
      setMetrics(tmp)
    } else if (values.length === 0) {
      setMetrics([])
    } else {
      values.map((el) => {
        if (metricsA.includes(el.value)) {
          setMetrics(metricsA.filter((el) => el !== el.value))
        } else {
          tmp.push(el.value)
          setMetrics(tmp)
        }
      })
    }
  }

  const useStyles = makeStyles({
    backgroundTag: {
      backgroundColor: 'springgreen !important',
    },
  })
  const buttonColor = useStyles()

  return (
    <Autocomplete
      style={autoCompStyle}
      renderTags={(value, getTagProps) =>
        value.map((option, index) => (
          <Chip
            key={option.id}
            classes={{
              root: classNames({
                [buttonColor.backgroundTag]: true,
              }),
            }}
            label={`${option.title}`}
            {...getTagProps({ index })}
          />
        ))
      }
      multiple
      onChange={myChangeFunc}
      id="tags-standard"
      options={availableOptions}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      getOptionLabel={(option) => option.title}
      // defaultValue={[availableOptions[0]]}
      renderInput={(params) => (
        <TextField
          inputprops={{ className: buttonColor.input }}
          style={txtBoxStyle}
          {...params}
          variant="standard"
          // label=""
          placeholder="More Metrics"
        />
      )}
    />
  )
}
