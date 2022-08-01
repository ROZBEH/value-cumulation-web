import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'
import { Favorite, CancelRounded } from '@material-ui/icons'
import { makeStyles } from '@material-ui/core/styles'
import Chip from '@material-ui/core/Chip'
import { Tooltip } from '@material-ui/core'
import classNames from 'classnames'
import {
  metrics as metricsAtom,
  userFavMetrics as userFavMetricsAtom,
} from 'src/recoil/atoms'
import { useRecoilState } from 'recoil'
import './UserAddedMetric.css'
import { useState } from 'react'
export const UserAddedMetric = () => {
  const [metricsA, setMetrics] = useRecoilState(metricsAtom)
  const [favoriteMetrics, setFavoriteMetrics] =
    useRecoilState(userFavMetricsAtom)
  // const diableFavButton = useState(favoriteMetrics.length === 0)
  const [defaultVisiableOptions, setdefaultVisiableOptions] = useState([])
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

  const loadFavoriteMetrics = () => {
    var tmp = availableOptions.filter((item) =>
      favoriteMetrics.includes(item.value)
    )
    setMetrics(favoriteMetrics)
    setdefaultVisiableOptions(tmp)
  }

  const myChangeFunc = (event, values, reason, detail) => {
    // tmp arrays for keeping the values of metrics
    // Metrics to be shown to the user
    var tmpMetrics = [...metricsA]
    // Metrics to be loaded inside the AutoComplete text field
    var tmpVisiableOptions = [...defaultVisiableOptions]
    // If the user has selected a metric, then add that metric to the list of metrics
    // that will be plotted. And if the user has removed a metric(removeOption),
    // then remove the metric from the list of available metrics
    if (reason === 'selectOption') {
      tmpMetrics.push(detail.option.value)
      setMetrics(tmpMetrics)
      tmpVisiableOptions.push(detail.option)
      setdefaultVisiableOptions(tmpVisiableOptions)
    } else if (reason === 'removeOption') {
      tmpMetrics = tmpMetrics.filter((item) => item !== detail.option.value)
      setMetrics(tmpMetrics)
      tmpVisiableOptions = tmpVisiableOptions.filter(
        (item) => item !== detail.option
      )
      setdefaultVisiableOptions(tmpVisiableOptions)
    } else if (reason === 'clear') {
      setMetrics([])
      setdefaultVisiableOptions([])
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

  const updateUserPickedMetrics = (values, getTagProps) => {
    {
      return values.map((option, index) => {
        return (
          <Chip
            key={option.id}
            size="medium"
            variant="outlined"
            classes={{
              root: classNames({
                [buttonColor.backgroundTag]: true,
              }),
            }}
            label={`${option.title}`}
            {...getTagProps({ index })}
            deleteIcon={
              <Tooltip title="Remove Metric">
                <CancelRounded />
              </Tooltip>
            }
            icon={
              <Tooltip title="Add to Favorite">
                <Favorite
                  fontSize="medium"
                  className={`cursor-pointer`}
                  style={{
                    color: favoriteMetrics.includes(option.value)
                      ? 'rgb(185 28 28)'
                      : 'rgb(156 163 175)',
                  }}
                  onClick={(e) => favIconOnClick(e, option)}
                />
              </Tooltip>
            }
          />
        )
      })
    }
  }

  const useStyles = makeStyles({
    backgroundTag: {
      backgroundColor: 'springgreen !important',
      fontFamily:
        '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
    },
  })
  const buttonColor = useStyles()

  return (
    <>
      <Autocomplete
        clearIcon={
          <Tooltip title="Clear all Metric">
            <CancelRounded />
          </Tooltip>
        }
        className="user-added-metric-autocomplete"
        renderTags={(value, getTagProps) =>
          updateUserPickedMetrics(value, getTagProps)
        }
        multiple
        onChange={myChangeFunc}
        id="tags-standard"
        filterSelectedOptions
        options={availableOptions}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        getOptionLabel={(option) => option.title}
        value={defaultVisiableOptions}
        renderInput={(params) => {
          return (
            <TextField
              inputProps={{ className: buttonColor.input }}
              className="txtBox-metric"
              {...params}
              variant="standard"
              placeholder="Add More Metrics"
            />
          )
        }}
      />
      <button
        className="disabled:bg-gainsboro rounded-lg bg-amber-200 text-xs px-2 py-1.5 cursor-pointer ml-1"
        onClick={loadFavoriteMetrics}
        name="comparisonMode"
        disabled={favoriteMetrics.length === 0}
      >
        {' '}
        Load Favorites
      </button>
    </>
  )
}
