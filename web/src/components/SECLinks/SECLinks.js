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
  const [reportNameArrays, setReportNameArrays] = useState([])
  const [allReportArrays, setAllReportArrays] = useState([])
  const [pickedReportArrays, setPickedReportArrays] = useState([])

  const onSelectCompany = async (_event, values, reason, _details) => {
    if (reason === 'selectOption') {
      const selectedCompanyReport = secReport[values.name]
      setAllReportArrays(selectedCompanyReport)
      setReportNameArrays(Object.keys(selectedCompanyReport))
    } else if (reason === 'clear') {
      setAllReportArrays([])
      setReportNameArrays([])
      setPickedReportArrays([])
    }
  }

  const onSelectReport = async (_event, values, reason, _details) => {
    if (reason === 'selectOption') {
      setPickedReportArrays(allReportArrays[values])
    } else if (reason === 'clear') {
      setPickedReportArrays([])
    }
  }

  const onSelectDate = async (_event, values, reason, _details) => {
    if (reason === 'selectOption') {
      console.log('picked')
    } else if (reason === 'clear') {
      console.log('cleared')
    }
  }
  return (
    <div>
      {calledCompanies.length > 0 && (
        <div>
          {/* Pick Company */}
          <Autocomplete
            onBlur={() => {
              setTimeout(() => {}, 100)
            }}
            onChange={(event, values, reason, details) =>
              onSelectCompany(event, values, reason, details)
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
          {/* Pick Report */}
          <Autocomplete
            onBlur={() => {
              setTimeout(() => {}, 100)
            }}
            onChange={(event, values, reason, details) =>
              onSelectReport(event, values, reason, details)
            }
            isOptionEqualToValue={(option, value) => option.id === value.id}
            options={reportNameArrays}
            getOptionLabel={(option) => option}
            renderInput={(params) => {
              return (
                <TextField
                  className="text-field-searchbar"
                  {...params}
                  variant="standard"
                  fullWidth
                  placeholder="Enter Report Name"
                />
              )
            }}
          />
          {/* Pick Date */}
          <Autocomplete
            onBlur={() => {
              setTimeout(() => {}, 100)
            }}
            onChange={(event, values, reason, details) =>
              onSelectDate(event, values, reason, details)
            }
            isOptionEqualToValue={(option, value) => option.id === value.id}
            options={pickedReportArrays}
            getOptionLabel={(option) => option.fillingDate}
            renderInput={(params) => {
              return (
                <TextField
                  className="text-field-searchbar"
                  {...params}
                  variant="standard"
                  fullWidth
                  placeholder="Pick a Report Date"
                />
              )
            }}
          />
        </div>
      )}
    </div>
  )
}
