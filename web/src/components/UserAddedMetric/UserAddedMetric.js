/**
Value Cumulation
Copyright (c) 2022 Value Cumulation

Notice: All code and information in this repository is the property of Value Cumulation.
You are strictly prohibited from distributing or using this repository unless otherwise stated.
 */

import { useState } from 'react'

import { makeStyles, Chip, Tooltip, TextField } from '@material-ui/core'
import { Favorite, CancelRounded } from '@material-ui/icons'
import { Autocomplete } from '@mui/material'
import classNames from 'classnames'
import { toast } from 'react-toastify'
import { useRecoilState } from 'recoil'

import { useAuth } from '@redwoodjs/auth'
import { useMutation } from '@redwoodjs/web'

import { AVAILABLE_METRICS } from 'src/commons/constants'
import { UPDATE_FAVORITES, DELETE_FAVORITES } from 'src/commons/gql'
import {
  metrics as metricsAtom,
  userFavMetrics as userFavMetricsAtom,
} from 'src/recoil/atoms'

export const UserAddedMetric = () => {
  const { isAuthenticated, currentUser, _logOut } = useAuth()
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

  // List of metrics that will be displayed in the form of plots to the user
  const [metricsA, setMetrics] = useRecoilState(metricsAtom)
  const [favoriteMetrics, setFavoriteMetrics] =
    useRecoilState(userFavMetricsAtom)

  // make cash flow and net income default visible
  const defaultVisables = AVAILABLE_METRICS.filter(
    (item) =>
      item.value === 'netIncome' ||
      item.value === 'freeCashFlow' ||
      item.value === 'grossProfitMargin' ||
      item.value === 'priceToEarning'
  )
  const [defaultVisiableOptions, setDefaultVisiableOptions] =
    useState(defaultVisables)

  const loadFavoriteMetrics = () => {
    if (!isAuthenticated) {
      toast.error('Please Login to add favorites')
      return
    }
    if (favoriteMetrics.length === 0) {
      toast.error(
        'You have no favorites yet.\n Please add some by clicking on ❤️'
      )
      return
    }
    var tmp = AVAILABLE_METRICS.filter((item) =>
      favoriteMetrics.includes(item.value)
    )
    setMetrics(favoriteMetrics)
    setDefaultVisiableOptions(tmp)
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
    if (currentUser === null) {
      toast.error('Please login to add favorites')
      return
    }
    var tmp = [...favoriteMetrics]
    var inData = {
      name: option.value,
      userId: currentUser.id,
    }
    if (!tmp.includes(option.value)) {
      tmp.push(option.value)
      // Update the database side
      updateFavoriteDB({ variables: { input: inData } })
      // Update the state side
      setFavoriteMetrics(tmp)
    } else {
      // Remove the metric from the database side
      deleteFavoriteDB({ variables: { input: inData } })
      // Remove the metric from the state side
      setFavoriteMetrics(tmp.filter((el) => el !== option.value))
    }
  }

  const updateUserPickedMetrics = (values, _getTagProps) => {
    {
      return values.map((option, _index) => {
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
            // {...getTagProps({ index })}
            deleteIcon={
              <Tooltip title="Remove Metric">
                <CancelRounded />
              </Tooltip>
            }
            onDelete={onDelete(option.title)}
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
  const onDelete = (title) => () => {
    setDefaultVisiableOptions((value) => value.filter((v) => v.title !== title))
  }

  return (
    <>
      <div className="flex flex-row mt-5 mb-3">
        <div className="w-96">
          <Autocomplete
            clearIcon={
              <Tooltip title="Clear all Metric">
                <CancelRounded />
              </Tooltip>
            }
            // renderTags={(value, getTagProps) =>
            //   updateUserPickedMetrics(value, getTagProps)
            // }
            renderTags={() => null}
            multiple
            onChange={myChangeFunc}
            id="tags-standard"
            filterSelectedOptions
            options={AVAILABLE_METRICS}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            getOptionLabel={(option) => option.title}
            value={defaultVisiableOptions}
            autoHighlight={true}
            renderInput={(params) => {
              return (
                <TextField
                  fullWidth={true}
                  inputProps={{
                    className: buttonColor.input,
                  }}
                  {...params}
                  variant="outlined"
                  label="Starting typing to add metrics"
                />
              )
            }}
          />
        </div>

        <div className="self-center ml-5">
          <Tooltip title="Click to Load Favorites">
            <button
              className=" whitespace-nowrap rounded-lg bg-green-300 border border-gray-300 text-sm px-2 py-1 cursor-pointer"
              onClick={loadFavoriteMetrics}
              name="comparisonMode"
              // disabled={favoriteMetrics.length === 0}
            >
              {' '}
              Load Favorites
            </button>
          </Tooltip>
        </div>
      </div>
      <div className="mb-10">
        {updateUserPickedMetrics(defaultVisiableOptions.reverse())}
      </div>
    </>
  )
}
