/**
Value Cumulation
Copyright (c) 2022 Value Cumulation

Notice: All code and information in this repository is the property of Value Cumulation.
You are strictly prohibited from distributing or using this repository unless otherwise stated.
 */
import * as React from 'react'

import { makeStyles, Tooltip } from '@material-ui/core'
import { CancelRounded } from '@material-ui/icons'
import { Autocomplete, TextField } from '@mui/material'
import { useRecoilState } from 'recoil'

import { AVAILABLE_METRICS } from 'src/commons/constants'
import { metricBox as metricBoxAtom } from 'src/recoil/atoms'
export const Metricsearch = (props) => {
  const [metricBox, setMetricBox] = useRecoilState(metricBoxAtom)
  const [inputValue, setInputValue] = React.useState('')
  const [pickedBefore, setPickedBefore] = React.useState(false)
  const useStyles = makeStyles({
    backgroundTag: {
      backgroundColor: 'rgb(134 239 172) !important',
      fontFamily:
        '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
    },
  })
  const buttonColor = useStyles()
  return (
    <div className="flex">
      <div className="w-full">
        <Autocomplete
          freeSolo={true}
          value={props.value}
          inputValue={inputValue}
          onInputChange={(_event, newInputValue) => {
            setInputValue(newInputValue)
          }}
          clearIcon={
            <Tooltip title="Clear">
              <CancelRounded />
            </Tooltip>
          }
          className="!mt-2.5"
          filterSelectedOptions
          onChange={(_event, newValue, reason) => {
            // Copy by value
            var tmp = metricBox.slice()
            for (var i = 0; i < tmp.length; i++) {
              if (newValue && tmp[i].value === newValue.value) {
                setPickedBefore(true)
                return
              }
            }
            if (reason === 'clear') {
              setPickedBefore(false)
              tmp[props.index] = {
                value: '',
                title: '',
                range: 0,
              }
              setMetricBox([...tmp])
            } else if (newValue) {
              tmp[props.index] = {
                value: newValue.value,
                title: newValue.title,
                range: 0,
              }
              setMetricBox([...tmp])
            }
          }}
          id="tags-standard"
          options={AVAILABLE_METRICS}
          isOptionEqualToValue={(option, value) => {
            return option.title === value.title
          }}
          getOptionLabel={(option) => option.title}
          renderInput={(params) => {
            return (
              <TextField
                sx={{ width: 300 }}
                inputProps={{ className: buttonColor.input }}
                className="!mb-4"
                {...params}
                variant="standard"
                placeholder="Add A Metric"
                error={pickedBefore}
                helperText={
                  pickedBefore ? 'Metric already picked, pick another one' : ''
                }
              />
            )
          }}
        />
      </div>
      <div className="w-full">
        <TextField
          sx={{ width: 200 }}
          className="!ml-2.5"
          id="margin-normal"
          type={'number'}
          onChange={(e) => {
            var tmp = metricBox.slice()
            tmp[props.index] = {
              value: tmp[props.index].value,
              title: tmp[props.index].title,
              range: e.target.value,
            }
            setMetricBox([...tmp])
          }}
          InputProps={{
            inputProps: {
              min: 0.0,
            },
          }}
          helperText={`Enter Numerical Values`}
        />
      </div>
    </div>
  )
}
