import { useState } from 'react'
import { useRecoilValue } from 'recoil'
import Autocomplete from '@mui/material/Autocomplete'
import { Tooltip, TextField } from '@material-ui/core'
import {
  secReports as secReportsAtom,
  calledCompanies as calledCompaniesAtom,
} from 'src/recoil/atoms'
export const SECLinks = () => {
  const calledCompanies = useRecoilValue(calledCompaniesAtom)
  const secReport = useRecoilValue(secReportsAtom)
  const [userSelect, setUserSelect] = useState({})
  const myChangeFunc = async (_event, values, reason, _details) => {
    if (reason === 'selectOption') {
      setUserSelect(values)
    } else if (reason === 'clear') {
      setUserSelect({})
    }
  }
  return (
    <div>
      {calledCompanies.length > 0 && (
        <div>
          <Autocomplete
            onBlur={() => {
              setTimeout(() => {}, 100)
            }}
            onChange={(event, values, reason, details) =>
              myChangeFunc(event, values, reason, details)
            }
            isOptionEqualToValue={(option, value) => option.id === value.id}
            options={calledCompanies}
            getOptionLabel={(option) => `${option.name} (${option.symbol})`}
            renderInput={(params) => {
              return (
                <TextField
                  className="text-field-searchbar"
                  {...params}
                  variant="standard"
                  fullWidth
                  placeholder="Enter Company Name"
                />
              )
            }}
          />
        </div>
      )}
    </div>
  )
}
