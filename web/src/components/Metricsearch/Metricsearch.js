import { makeStyles, Tooltip } from '@material-ui/core'
import { CancelRounded } from '@material-ui/icons'
import { Autocomplete, TextField } from '@mui/material'

import { AVAILABLE_METRICS } from 'src/commons/constants'

export const Metricsearch = () => {
  const useStyles = makeStyles({
    backgroundTag: {
      backgroundColor: 'rgb(134 239 172) !important',
      fontFamily:
        '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
    },
  })
  const buttonColor = useStyles()
  return (
    <div className="grid grid-cols-2">
      <Autocomplete
        clearIcon={
          <Tooltip title="Clear">
            <CancelRounded />
          </Tooltip>
        }
        className="!w-4/5 !mb-5 !mt-2.5"
        onChange={console.log('hi')}
        id="tags-standard"
        filterSelectedOptions
        options={AVAILABLE_METRICS}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        getOptionLabel={(option) => option.title}
        renderInput={(params) => {
          return (
            <TextField
              inputProps={{ className: buttonColor.input }}
              className="w-fit !mb-4 "
              {...params}
              variant="standard"
              placeholder="Add A Metric"
            />
          )
        }}
      />
      <TextField
        id="margin-normal"
        type={'number'}
        InputProps={{
          inputProps: {
            min: 0.0,
          },
        }}
      />
    </div>
  )
}
