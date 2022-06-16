import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'
import { makeStyles } from '@mui/styles'
import Chip from '@material-ui/core/Chip'
import classNames from 'classnames'
import { metrics } from 'src/recoil/atoms'
import { useRecoilState } from 'recoil'

export const UserAddedMetric = () => {
  const [metricsA, setMetrics] = useRecoilState(metrics)
  const availableOptions = [
    { id: 4, title: 'Free Cash Flow', value: 'freeCashFlow' },
    {
      id: 5,
      title: 'Market Cap Change With Retained Earnings',
      value: 'marketCapChangeWithRetainedEarnings',
    },
  ]

  const textBox = {
    width: '50%',
    marginBottom: '1rem',
  }

  const myChangeFunc = (event, values) => {
    const tmp = [...metricsA]
    values.map((el) => {
      if (metricsA.includes(el.value)) {
        setMetrics(metricsA.filter((el) => el !== el.value))
      } else {
        tmp.push(el.value)
        setMetrics(tmp)
      }
    })
  }

  const useStyles = makeStyles({
    backgroundTag: {
      backgroundColor: 'springgreen !important',
    },
  })
  const classes = useStyles()

  return (
    <Autocomplete
      renderTags={(value, getTagProps) =>
        value.map((option, index) => (
          <Chip
            key={option.id}
            classes={{
              root: classNames({
                [classes.backgroundTag]: true,
              }),
            }}
            label={`${option.title}`}
            {...getTagProps({ index })}
          />
        ))
      }
      multiple
      onChange={myChangeFunc}
      id="tags-standard"
      options={availableOptions}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      getOptionLabel={(option) => option.title}
      // defaultValue={[availableOptions[0]]}
      renderInput={(params) => (
        <TextField
          inputProps={{ className: classes.input }}
          style={textBox}
          {...params}
          variant="standard"
          // label=""
          placeholder="More Metrics"
        />
      )}
    />
  )
}
