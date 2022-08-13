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
      <h1>ProfilePage</h1>
      {favoriteMetrics.map((metric, index) => {
        return <p key={index}>{metric}</p>
      })}
    </>
  )
}

export default ProfilePage
