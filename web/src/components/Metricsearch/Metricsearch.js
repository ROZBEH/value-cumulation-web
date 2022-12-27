/**
Value Cumulation
Copyright (c) 2022 Value Cumulation

Notice: All code and information in this repository is the property of Value Cumulation.
You are strictly prohibited from distributing or using this repository unless otherwise stated.
 */
import { makeStyles, Tooltip } from '@material-ui/core'
import { CancelRounded } from '@material-ui/icons'
import { Autocomplete, TextField } from '@mui/material'

import { AVAILABLE_METRICS } from 'src/commons/constants'

export const Metricsearch = (props) => {
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
          clearIcon={
            <Tooltip title="Clear">
              <CancelRounded />
            </Tooltip>
          }
          className="!mt-2.5"
          // onChange={console.log('hi')}
          id="tags-standard"
          filterSelectedOptions
          options={AVAILABLE_METRICS}
          isOptionEqualToValue={(option, value) => option.id === value.id}
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
          InputProps={{
            inputProps: {
              min: 0.0,
            },
          }}
          helperText={`Pick values in ${props.minRange} to ${props.maxRange} range`}
        />
      </div>
    </div>
  )
}
