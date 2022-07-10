import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'
import { makeStyles } from '@mui/styles'
import Chip from '@material-ui/core/Chip'
import classNames from 'classnames'
import { metrics } from 'src/recoil/atoms'
import { useRecoilState } from 'recoil'

export const UserAddedMetric = () => {
  const [metricsA, setMetrics] = useRecoilState(metrics)
  // List of available metrics for now. This list will be updated as we
  // decide on the list of metrics to be shown to the user.
  const availableOptions = [
    {
      id: 0,
      title: 'Market Cap Change With Retained Earnings',
      value: 'marketCapChangeWithRetainedEarnings',
    },
    { id: 1, title: 'Gross Profit Margin', value: 'grossProfitMargin' },
    { id: 2, title: 'Net Profit Margin', value: 'netProfitMargin' },
    { id: 3, title: 'Debt Ratio', value: 'debtRatio' },
    { id: 4, title: 'Burn Ratio', value: 'burnRatio' },
    { id: 5, title: 'Price To Earning', value: 'priceToEarning' },
    { id: 6, title: 'R & D Budget To Revenue', value: 'rAndDBudgetToRevenue' },
    { id: 7, title: 'Current Ratio', value: 'currentRatio' },
    {
      id: 8,
      title: 'Price to Free Cash Flow',
      value: 'priceToFreeCashFlowsRatio',
    },
    { id: 9, title: 'Operating Cash Flow', value: 'operatingCashFlow' },
    {
      id: 10,
      title: 'Free Cash Flow to Net Income',
      value: 'freeCashFlowToNetIncome',
    },
    {
      id: 11,
      title: 'Operating Cash Flow to Current Liabilities',
      value: 'operatingCFToCurrentLiabilities',
    },
    { id: 12, title: 'Dividend Yield', value: 'dividendYield' },
    {
      id: 13,
      title: 'Income Tax to Net Income',
      value: 'incomeTaxToNetIncome',
    },
    {
      id: 14,
      title: 'Return on Retained Earning',
      value: 'returnOnRetainedEarnings',
    },
    {
      id: 15,
      title: 'Market Cap Change with Retained Earning',
      value: 'marketCapChangeWithRetainedEarnings',
    },
    {
      id: 16,
      title: 'Mean Net Income Growth Rate',
      value: 'meanNetIncomeGrowthRate',
    },
    {
      id: 17,
      title: 'Mean Free Cash Flow Growth Rate',
      value: 'meanFCFGrowthRate',
    },
    { id: 18, title: 'Intrinsic Value', value: 'intrinsicValue' },
  ]

  const textBox = {
    width: '50%',
    marginBottom: '1rem',
  }

  const autoComp = {
    width: '60%',
    marginBottom: '2rem',
    marginTop: '2rem',
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
      console.log(values)
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
  const classes = useStyles()

  return (
    <Autocomplete
      style={autoComp}
      renderTags={(value, getTagProps) =>
        value.map((option, index) => (
          <Chip
            key={option.id}
            classes={{
              root: classNames({
                [classes.backgroundTag]: true,
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
          inputprops={{ className: classes.input }}
          style={textBox}
          {...params}
          variant="standard"
          // label=""
          placeholder="More Metrics"
        />
      )}
    />
  )
}
