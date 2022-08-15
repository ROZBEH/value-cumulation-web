import { useAuth } from '@redwoodjs/auth'
import { Autocomplete, TextField } from '@mui/material'
import { Favorite, CancelRounded } from '@material-ui/icons'
import { makeStyles, Chip, Tooltip } from '@material-ui/core'
import { toast } from '@redwoodjs/web/toast'
import classNames from 'classnames'
import {
  metrics as metricsAtom,
  userFavMetrics as userFavMetricsAtom,
} from 'src/recoil/atoms'
import { useRecoilState } from 'recoil'
import './UserAddedMetric.css'
import { useState } from 'react'
import { useMutation } from '@redwoodjs/web'
import { UPDATE_FAVORITES, DELETE_FAVORITES } from 'src/commons/gql'
import { AVAILABLE_METRICS } from 'src/commons/constants'

export const UserAddedMetric = () => {
  const { _isAuthenticated, currentUser, _logOut } = useAuth()
  const [updateFavoriteDB, { _loading, _error }] = useMutation(
    UPDATE_FAVORITES,
    {
      onCompleted: (_data) => {
        toast.success('Successfully Added')
      },
    }
  )
  const [deleteFavoriteDB] = useMutation(DELETE_FAVORITES, {
    onCompleted: (_data) => {
      toast.success('Successfully Removed')
    },
  })
  const [metricsA, setMetrics] = useRecoilState(metricsAtom)
  const [favoriteMetrics, setFavoriteMetrics] =
    useRecoilState(userFavMetricsAtom)

  // make cash flow and net income default visiable
  const defaultVisables = AVAILABLE_METRICS.filter(
    (item) => item.value === 'netIncome' || item.value === 'freeCashFlow'
  )
  const [defaultVisiableOptions, setDefaultVisiableOptions] =
    useState(defaultVisables)

  const loadFavoriteMetrics = () => {
    if (favoriteMetrics.length === 0) {
      // alert('You have no favorite metrics yet!')
      toast.error(
        'You have no favorites yet.\n Please add some by clicking on ❤️'
      )
    }
    var tmp = AVAILABLE_METRICS.filter((item) =>
      favoriteMetrics.includes(item.value)
    )
    setMetrics(favoriteMetrics)
    setDefaultVisiableOptions(tmp)
    console.log('tmp: ', tmp)
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
      setDefaultVisiableOptions(tmpVisiableOptions)
    } else if (reason === 'removeOption') {
      tmpMetrics = tmpMetrics.filter((item) => item !== detail.option.value)
      setMetrics(tmpMetrics)
      tmpVisiableOptions = tmpVisiableOptions.filter(
        (item) => item !== detail.option
      )
      setDefaultVisiableOptions(tmpVisiableOptions)
    } else if (reason === 'clear') {
      setMetrics([])
      setDefaultVisiableOptions([])
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
                      ? // corresponds to text-red-500
                        'rgb(239 68 68)'
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
      backgroundColor: 'rgb(134 239 172) !important',
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
        options={AVAILABLE_METRICS}
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
      <Tooltip title="Click to Load Favorites">
        <button
          className="disabled:bg-gainsboro rounded-lg bg-green-300 border border-gray-300 text-xs px-2 py-1.5 cursor-pointer ml-1"
          onClick={loadFavoriteMetrics}
          name="comparisonMode"
          // disabled={favoriteMetrics.length === 0}
        >
          {' '}
          Load Favorites
        </button>
      </Tooltip>
    </>
  )
}
