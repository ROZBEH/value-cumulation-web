/**
Value Cumulation
Copyright (c) 2022 Value Cumulation

Notice: All code and information in this repository is the property of Value Cumulation.
You are strictly prohibited from distributing or using this repository unless otherwise stated.
 */

import { Tooltip } from '@material-ui/core'
import { Favorite } from '@material-ui/icons'
import { useRecoilState } from 'recoil'

import { useAuth } from '@redwoodjs/auth'
import { useMutation } from '@redwoodjs/web'

import {
  metrics as metricsAtom,
  userFavMetrics as userFavMetricsAtom,
} from 'src/recoil/atoms'
import './Buttons.css'

const UPDATE_FAVORITES = gql`
  mutation addmetric($input: CreateFavoriteMetricInput!) {
    createFavoriteMetric(input: $input) {
      id
      name
    }
  }
`
const DELETE_FAVORITES = gql`
  mutation remove($input: DeleteFavoriteMetricOnUserInput!) {
    deleteFavoriteMetricOnUser(input: $input) {
      id
    }
  }
`
// Buttons that are visible on the main submission page
//There are more more buttons in the dropdown menu
const VisiableButtons = [
  { id: 0, title: 'Net Profit Margin', value: 'netProfitMargin' },
  { id: 1, title: 'Debt Ratio', value: 'debtRatio' },
  { id: 2, title: 'Net Income', value: 'netIncome' },
  { id: 3, title: 'Free Cash Flow', value: 'freeCashFlow' },
]

export const Mapping = () => {
  const { _isAuthenticated, currentUser, _logOut } = useAuth()
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
  const [favoriteMetrics, setFavoriteMetrics] =
    useRecoilState(userFavMetricsAtom)
  const [metrics, setMetrics] = useRecoilState(metricsAtom)
  // Update the list of available metrics as the user selects buttons
  const handleButton = (buttonValue) => {
    const tmp = [...metrics]
    if (metrics.includes(buttonValue)) {
      setMetrics(metrics.filter((el) => el !== buttonValue))
    } else {
      tmp.push(buttonValue)
      setMetrics(tmp)
    }
  }
  const favIconOnClick = (event, option) => {
    var tmp = [...favoriteMetrics]
    var inData = {
      name: option.value,
      userId: currentUser.id,
    }
    if (!tmp.includes(option.value)) {
      updateFavoriteDB({ variables: { input: inData } })
      tmp.push(option.value)
      setFavoriteMetrics(tmp)
    } else {
      deleteFavoriteDB({ variables: { input: inData } })
      setFavoriteMetrics(tmp.filter((el) => el !== option.value))
    }
  }

  return (
    <div className="div-btn">
      {VisiableButtons.map((bt) => (
        <div key={bt.id} className="flex items-center">
          <button
            className={`text-red-500 text-xs pl-1.5 rounded-l-lg h-9 cursor-pointer ${
              metrics.includes(bt.value) ? 'bg-green-300' : 'bg-gainsboro'
            } `}
          >
            <Tooltip title="Add to Favorite">
              <Favorite
                onClick={(e) => favIconOnClick(e, bt)}
                className={`${
                  favoriteMetrics.includes(bt.value)
                    ? 'text-red-500'
                    : 'text-gray-400'
                }`}
                fontSize="medium"
              />
            </Tooltip>
          </button>
          <Tooltip title="Add or Remove Metric">
            <button
              onClick={() => handleButton(bt.value)}
              className={`text-xs pl-1.5 mr-2.5 pr-1.5 rounded-r-lg h-9 cursor-pointer ${
                metrics.includes(bt.value) ? 'bg-green-300' : 'bg-gainsboro'
              } `}
              value={bt.value}
            >
              {bt.title}
            </button>
          </Tooltip>
        </div>
      ))}
    </div>
  )
}
