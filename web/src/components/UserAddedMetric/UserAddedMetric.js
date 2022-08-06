import TextField from '@mui/material/TextField'
import { useAuth } from '@redwoodjs/auth'
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
import { useMutation } from '@redwoodjs/web'
const UPDATE_FAVORITES = gql`
  mutation addmetric($input: CreateFavoriteMetricInput!) {
    createFavoriteMetric(input: $input) {
      id
      name
    }
  }
`
const DELETE_FAVORITES = gql`
  mutation addmetric($input: DeleteFavoriteMetricOnUser!) {
    deleteFavoriteMetricOnUser(input: $input) {
      id
    }
  }
`
export const UserAddedMetric = () => {
  const { _isAuthenticated, currentUser, _logOut } = useAuth()
  const [updateFavoriteDB, { loading, error }] = useMutation(UPDATE_FAVORITES, {
    onCompleted: (data) => {
      console.log(data)
    },
  })
  const [deleteFavoriteDB] = useMutation(DELETE_FAVORITES, {
    onCompleted: (data) => {
      console.log(data)
    },
  })
  const [metricsA, setMetrics] = useRecoilState(metricsAtom)
  const [favoriteMetrics, setFavoriteMetrics] =
    useRecoilState(userFavMetricsAtom)
  // const diableFavButton = useState(favoriteMetrics.length === 0)
  const [defaultVisiableOptions, setdefaultVisiableOptions] = useState([])
  // List of available metrics for now. This list will be updated as we
  // decide on the list of metrics to be shown to the user.
  const availableMetrics = [
    'marketCapChangeWithRetainedEarnings',
    'grossProfitMargin',
    'burnRatio',
    'priceToEarning',
    'rAndDBudgetToRevenue',
    'currentRatio',
    'priceToFreeCashFlowsRatio',
    'operatingCashFlow',
    'freeCashFlowToNetIncome',
    'operatingCFToCurrentLiabilities',
    'dividendYield',
    'incomeTaxToNetIncome',
    'returnOnRetainedEarnings',
    'meanNetIncomeGrowthRate',
    'meanFCFGrowthRate',
    'intrinsicValue',
  ].sort()
  const availableOptions = availableMetrics.map((item, index) => ({
    id: index,
    value: item,
    // First capitalize the first letter of the metric name and
    // then place space between capitalized section.
    title: (item[0].toUpperCase() + item.slice(1))
      .match(/[A-Z]+(?![a-z])|[A-Z]?[a-z]+|\d+/g)
      .join(' '),
  }))

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
    var inData = {
      name: option.value,
      userId: currentUser.id,
    }
    if (!tmp.includes(option.value)) {
      tmp.push(option.value)
      updateFavoriteDB({ variables: { input: inData } })
      setFavoriteMetrics(tmp)
    } else {
      deleteFavoriteDB({ variables: { input: inData } })
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
