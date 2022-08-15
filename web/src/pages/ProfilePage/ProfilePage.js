import { MetaTags, useMutation } from '@redwoodjs/web'
import { useLazyQuery } from '@apollo/react-hooks'
import { Autocomplete, TextField } from '@mui/material'
import { Favorite, CancelRounded } from '@material-ui/icons'
import { makeStyles, Chip, Tooltip } from '@material-ui/core'
import classNames from 'classnames'
import { useAuth } from '@redwoodjs/auth'
import { useEffect, useState } from 'react'
import { useRecoilState } from 'recoil'
import { userFavMetrics as userFavMetricsAtom } from 'src/recoil/atoms'
import { DataGrid } from '@mui/x-data-grid'
import { toast } from '@redwoodjs/web/toast'

const UPDATE_FAVORITES = gql`
  mutation addmetric($input: CreateFavoriteMetricInput!) {
    createFavoriteMetric(input: $input) {
      id
      name
    }
  }
`
const DELETE_FAVORITES = gql`
  mutation removemetric($input: DeleteFavoriteMetricOnUserInput!) {
    deleteFavoriteMetricOnUser(input: $input) {
      id
    }
  }
`

const DELETE_ALL_FAVORITES = gql`
  mutation removeALLmetric($id: Int!) {
    deleteAllFavoritesUser(id: $id) {
      id
      email
    }
  }
`

const ProfilePage = () => {
  const [favoriteMetrics, _setFavoriteMetrics] =
    useRecoilState(userFavMetricsAtom)
  const availableMetrics = [
    'netProfitMargin',
    'debtRatio',
    'netIncome',
    'freeCashFlow',
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
  // make cash flow and net income default visiable
  const defaultVisables = availableOptions.filter((item) =>
    favoriteMetrics.includes(item.value)
  )
  const [defaultVisiableOptions, setDefaultVisiableOptions] =
    useState(defaultVisables)
  const { isAuthenticated, currentUser, _logOut } = useAuth()
  const [updateFavoriteDB] = useMutation(UPDATE_FAVORITES, {
    onCompleted: (data) => {
      //pass
      // Placeholder for future use
      console.log(data)
      toast.success('Successfully Added')
    },
  })
  const [deleteFavoriteDB] = useMutation(DELETE_FAVORITES, {
    onCompleted: (_data) => {
      //pass
      // Placeholder for future use
      toast.success('Successfully Removed')
    },
  })
  const [deleteFavoritesAll] = useMutation(DELETE_ALL_FAVORITES, {
    onCompleted: (_data) => {
      //pass
      // Placeholder for future use
      toast.success('Successfully Removed All Favorites.')
    },
  })
  const updateUserPickedMetrics = (values, getTagProps) => {
    {
      return values.map((option, index) => {
        return (
          <Chip
            key={option.id}
            size="medium"
            variant="outlined"
            label={`${option.title}`}
            {...getTagProps({ index })}
            deleteIcon={
              <Tooltip title="Remove Metric">
                <CancelRounded />
              </Tooltip>
            }
          />
        )
      })
    }
  }

  const myChangeFunc = (event, values, reason, detail) => {
    // Metrics to be loaded inside the AutoComplete text field
    var tmpVisiableOptions = [...defaultVisiableOptions]
    // If the user has selected a metric, then add that metric to the list of metrics
    // that will be plotted. And if the user has removed a metric(removeOption),
    // then remove the metric from the list of available metrics
    let inData
    if (reason === 'selectOption') {
      inData = {
        name: detail.option.value,
        userId: currentUser.id,
      }
      updateFavoriteDB({ variables: { input: inData } })
      tmpVisiableOptions.push(detail.option)
      setDefaultVisiableOptions(tmpVisiableOptions)
    } else if (reason === 'removeOption') {
      inData = {
        name: detail.option.value,
        userId: currentUser.id,
      }
      deleteFavoriteDB({ variables: { input: inData } })
      tmpVisiableOptions = tmpVisiableOptions.filter(
        (item) => item !== detail.option
      )
      setDefaultVisiableOptions(tmpVisiableOptions)
    } else if (reason === 'clear') {
      setDefaultVisiableOptions([])
      deleteFavoritesAll({ variables: { id: currentUser.id } })
    }
  }

  return (
    <>
      <MetaTags title="Profile" description="Profile page" />

      <div className="relative rounded-xl overflow-auto mx-12 mr-14">
        <div className="overflow-hidden my-8">
          <table className="border-collapse table-auto w-full text-sm">
            <tbody>
              <tr>
                <th className="text-center border-b dark:border-slate-600 font-medium p-4 pl-8 pb-3 text-slate-400 dark:text-slate-200 text-left">
                  Email
                </th>
                <td className="border-b dark:border-slate-600">
                  {currentUser.email}
                </td>
              </tr>
              <tr>
                <th className="text-center border-b dark:border-slate-600 font-medium p-4 pl-8 pb-3 text-slate-400 dark:text-slate-200 text-left">
                  Favorites
                </th>
                <td className="border-b dark:border-slate-600">
                  {/* {favoriteMetrics.map((metric, index) => (
                    <span key={index}>{metric}, </span>
                  ))} */}
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
                    isOptionEqualToValue={(option, value) =>
                      option.id === value.id
                    }
                    getOptionLabel={(option) => option.title}
                    value={defaultVisiableOptions}
                    renderInput={(params) => {
                      return (
                        <TextField
                          // inputProps={{ className: buttonColor.input }}
                          className="txtBox-metric"
                          {...params}
                          variant="standard"
                          placeholder="Add To Favorites"
                        />
                      )
                    }}
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}

export default ProfilePage
