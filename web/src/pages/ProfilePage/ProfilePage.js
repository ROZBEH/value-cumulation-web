import { MetaTags, useMutation } from '@redwoodjs/web'
import { useLazyQuery } from '@apollo/react-hooks'
import { Autocomplete, TextField } from '@mui/material'
import { Favorite, CancelRounded } from '@material-ui/icons'
import { makeStyles, Chip, Tooltip } from '@material-ui/core'
import classNames from 'classnames'
import { useAuth } from '@redwoodjs/auth'
import { useEffect, useState } from 'react'

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
const USER_INFO = gql`
  query queryUser($id: Int!) {
    user(id: $id) {
      email
      id
      favorites {
        id
        name
      }
    }
  }
`
const ProfilePage = () => {
  const [jsonResponse, setJsonResponse] = useState({})
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
  const [queryUser] = useLazyQuery(USER_INFO)

  useEffect(() => {
    if (isAuthenticated) {
      console.log(currentUser)
      queryUser({ variables: { id: currentUser.id } }).then((jsonRes) => {
        console.log(jsonRes.data)
        setJsonResponse(jsonRes)
      })
    }
  }, [currentUser, queryUser, isAuthenticated])
  return (
    <>
      <MetaTags title="Profile" description="Profile page" />
      <h1>ProfilePage</h1>
      {/* <h2>{currentUser.email}</h2> */}
      <h3>{JSON.stringify(jsonResponse)}</h3>
    </>
  )
}

export default ProfilePage
