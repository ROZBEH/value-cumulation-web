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
// const USER_INFO = gql`
//   query queryUser($id: Int!) {
//     user(id: $id) {
//       email
//       id
//       favorites {
//         id
//         name
//       }
//     }
//   }
// `
const ProfilePage = () => {
  const [favoriteMetrics, _setFavoriteMetrics] =
    useRecoilState(userFavMetricsAtom)
  const { isAuthenticated, currentUser, _logOut } = useAuth()
  const [updateFavoriteDB] = useMutation(UPDATE_FAVORITES, {
    onCompleted: (_data) => {
      //pass
      // Placeholder for future use
    },
  })
  const [deleteFavoriteDB] = useMutation(DELETE_FAVORITES, {
    onCompleted: (_data) => {
      //pass
      // Placeholder for future use
    },
  })

  return (
    <>
      <MetaTags title="Profile" description="Profile page" />

      <div className="relative rounded-xl overflow-auto ml-2.5 mr-14">
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
                  {favoriteMetrics.map((metric, index) => (
                    <span key={index}>{metric}, </span>
                  ))}
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
