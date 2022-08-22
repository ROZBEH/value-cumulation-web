import { useRecoilState, useRecoilValue } from 'recoil'
import Autocomplete from '@mui/material/Autocomplete'
import { Tooltip, TextField } from '@material-ui/core'
import {
  secReports as secReportsAtom,
  calledCompanies as calledCompaniesAtom,
} from 'src/recoil/atoms'
import {
  reportNameArrays as reportNameArraysAtom,
  allReportArrays as allReportArraysAtom,
  pickedReportArrays as pickedReportArraysAtom,
  reportLink as reportLinkAtom,
  valueCompany as valueAtom,
  inputValueCompany as inputValueAtom,
  valueReport as valueReportAtom,
  inputValueReport as inputValueReportAtom,
  valueDate as valueDateAtom,
  inputValueDate as inputValueDateAtom,
} from 'src/recoil/secLinks'
export const SECLinks = () => {
  const calledCompanies = useRecoilValue(calledCompaniesAtom)

  const secReport = useRecoilValue(secReportsAtom)
  const [reportNameArrays, setReportNameArrays] =
    useRecoilState(reportNameArraysAtom)
  const [allReportArrays, setAllReportArrays] =
    useRecoilState(allReportArraysAtom)
  const [pickedReportArrays, setPickedReportArrays] = useRecoilState(
    pickedReportArraysAtom
  )
  const [reportLink, setReportLink] = useRecoilState(reportLinkAtom)
  const [valueCompany, setValueCompany] = useRecoilState(valueAtom)
  const [inputValueCompany, setInputValueCompany] =
    useRecoilState(inputValueAtom)
  const [valueReport, setValueReport] = useRecoilState(valueReportAtom)
  const [inputValueReport, setInputValueReport] =
    useRecoilState(inputValueReportAtom)
  const [valueDate, setValueDate] = useRecoilState(valueDateAtom)
  const [inputValueDate, setInputValueDate] = useRecoilState(inputValueDateAtom)

  const onSelectCompany = async (_event, values, reason, _details) => {
    setValueCompany(values)
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
    setValueReport(values)
    if (reason === 'selectOption') {
      setPickedReportArrays(allReportArrays[values])
    } else if (reason === 'clear') {
      setPickedReportArrays([])
      setReportLink('')
    }
  }

  const onSelectDate = async (_event, values, reason, _details) => {
    setValueDate(values)
    if (reason === 'selectOption') {
      setReportLink(values.link)
    } else if (reason === 'clear') {
      setReportLink('')
    }
  }
  return (
    <>
      <div>
        <div>
          {calledCompanies.length > 0 && (
            <div>
              {/* Pick Company */}
              <Autocomplete
                onBlur={() => {
                  setTimeout(() => {}, 100)
                }}
                value={valueCompany || null}
                onChange={(event, values, reason, details) =>
                  onSelectCompany(event, values, reason, details)
                }
                inputValue={inputValueCompany}
                onInputChange={(_e, newInputValue) => {
                  setInputValueCompany(newInputValue)
                }}
                id="company-select"
                options={calledCompanies}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                getOptionLabel={(option) => `${option.name} (${option.symbol})`}
                // sx={{ width: 300 }}
                renderInput={(params) => (
                  <TextField
                    className="text-field-searchbar"
                    variant="standard"
                    fullWidth
                    {...params}
                    label="Pick a Company"
                  />
                )}
              />
              {/* Pick Report */}
              <Autocomplete
                onBlur={() => {
                  setTimeout(() => {}, 100)
                }}
                value={valueReport || null}
                onChange={(event, values, reason, details) =>
                  onSelectReport(event, values, reason, details)
                }
                inputValue={inputValueReport}
                onInputChange={(_e, newInputValue) => {
                  setInputValueReport(newInputValue)
                }}
                id="report-select"
                options={reportNameArrays}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                getOptionLabel={(option) => option}
                // sx={{ width: 300 }}
                renderInput={(params) => (
                  <TextField
                    className="text-field-searchbar"
                    variant="standard"
                    fullWidth
                    {...params}
                    label="Pick a Report"
                  />
                )}
              />
              {/* Pick Date */}
              <Autocomplete
                onBlur={() => {
                  setTimeout(() => {}, 100)
                }}
                value={valueDate || null}
                onChange={(event, values, reason, details) =>
                  onSelectDate(event, values, reason, details)
                }
                inputValue={inputValueDate}
                onInputChange={(_e, newInputValue) => {
                  setInputValueDate(newInputValue)
                }}
                id="date-select"
                options={pickedReportArrays}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                getOptionLabel={(option) => option.fillingDate}
                // sx={{ width: 300 }}
                renderInput={(params) => (
                  <TextField
                    className="text-field-searchbar"
                    variant="standard"
                    fullWidth
                    {...params}
                    label="Pick a Date"
                  />
                )}
              />
            </div>
          )}
        </div>

        {reportLink && (
          <div className="clear-both">
            <Tooltip title="Report Link">
              <button
                className="rounded-lg w-20 h-8 bg-lightsky-blue border border-gray-300 text-white text-xs cursor-pointer ml-1"
                name="comparisonMode"
                onClick={() => window.open(reportLink)}
              >
                Report Link
              </button>
            </Tooltip>
          </div>
        )}
      </div>
    </>
  )
}
