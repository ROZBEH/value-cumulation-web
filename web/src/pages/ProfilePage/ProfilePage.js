import { MetaTags, useMutation } from '@redwoodjs/web'
import { Autocomplete, TextField } from '@mui/material'
import { CancelRounded } from '@material-ui/icons'
import { Chip, Tooltip } from '@material-ui/core'
import { useAuth } from '@redwoodjs/auth'
import { useState, useEffect } from 'react'
import { useRecoilValue, useRecoilState } from 'recoil'
import {
  userFavMetrics as userFavMetricsAtom,
  companyList as companyListAtom,
} from 'src/recoil/atoms'
import { toast } from '@redwoodjs/web/toast'
import { useLazyQuery } from '@apollo/react-hooks'
import {
  STARTUP_QUERY,
  UPDATE_FAVORITES,
  DELETE_FAVORITES,
  DELETE_ALL_FAVORITES,
} from 'src/commons/gql'
import { AVAILABLE_METRICS } from 'src/commons/constants'

const ProfilePage = () => {
  const [_companyList, setCompanyList] = useRecoilState(companyListAtom)
  const [getArticles, { _loading, _error, _data }] = useLazyQuery(STARTUP_QUERY)
  const [favoriteMetrics, setUserFavMetrics] =
    useRecoilState(userFavMetricsAtom)
  const [defaultVisiableOptions, setDefaultVisiableOptions] = useState([])
  const { _isAuthenticated, currentUser, _logOut } = useAuth()
  const [updateFavoriteDB] = useMutation(UPDATE_FAVORITES, {
    onCompleted: (_data) => {
      toast.success('Successfully Added')
    },
  })
  const [deleteFavoriteDB] = useMutation(DELETE_FAVORITES, {
    onCompleted: (_data) => {
      toast.success('Successfully Removed')
    },
  })
  const [deleteFavoritesAll] = useMutation(DELETE_ALL_FAVORITES, {
    onCompleted: (_data) => {
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

  useEffect(() => {
    getArticles({
      variables: { id: currentUser.id },
    }).then((jsonRes) => {
      setCompanyList(jsonRes.data.searchbar)
      var favMetrics = jsonRes.data.user.favorites.map(function (fav) {
        return fav.name
      })
      setUserFavMetrics(favMetrics)
      const defaultVisables = AVAILABLE_METRICS.filter((item) =>
        favMetrics.includes(item.value)
      )
      setDefaultVisiableOptions(defaultVisables)
    })
  }, [getArticles, setCompanyList, currentUser, setUserFavMetrics])

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
                  {favoriteMetrics && (
                    <Autocomplete
                      clearIcon={
                        <Tooltip title="Clear all Metric">
                          <CancelRounded />
                        </Tooltip>
                      }
                      className="!w-4/5 !mb-5 !mt-2.5"
                      renderTags={(value, getTagProps) =>
                        updateUserPickedMetrics(value, getTagProps)
                      }
                      multiple
                      onChange={myChangeFunc}
                      id="tags-standard"
                      filterSelectedOptions
                      options={AVAILABLE_METRICS}
                      isOptionEqualToValue={(option, value) =>
                        option.id === value.id
                      }
                      getOptionLabel={(option) => option.title}
                      value={defaultVisiableOptions}
                      renderInput={(params) => {
                        return (
                          <TextField
                            // inputProps={{ className: buttonColor.input }}
                            className="!w-4/5 !mb-4"
                            {...params}
                            variant="standard"
                            placeholder="Add To Favorites"
                          />
                        )
                      }}
                    />
                  )}
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
