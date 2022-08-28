import {
  // Form,
  // Submit,
  useForm,
  // TextField
  // TextField as RwTextField,
} from '@redwoodjs/forms'
import { Tooltip, TextField } from '@material-ui/core'
import CircularProgress from '@mui/material/CircularProgress'
import * as React from 'react'
import Autocomplete from '@mui/material/Autocomplete'
import { useLazyQuery } from '@apollo/client'
import { COMPANY_QUERY } from 'src/commons/gql'
import { useRecoilState, useRecoilValue } from 'recoil'
import {
  calledCompanies as calledCompaniesAtom,
  loadingFinancials as loadingFinancialsAtom,
  companyList as companyListAtom,
  plottingData as plottingDataAtom,
  suggestions as suggestionsAtom,
  textPrompt as textPromptAtom,
  counterCompany as counterCompanyAtom,
  secReports as secReportsAtom,
  valueTicker as valueTickerAtom,
  inputValueTicker as inputValueTickerAtom,
} from 'src/recoil/atoms'
import './Mainsubmission.css'
import {
  popCompany,
  postProcess,
} from 'src/components/Mainsubmission/utilitiesMainsubmission'
import { useEffect } from 'react'

export const Mainsubmission = () => {
  const [_calledCompanies, setCalledCompanies] =
    useRecoilState(calledCompaniesAtom)
  const [_loadingFinancials, setLoading] = useRecoilState(loadingFinancialsAtom)
  const companyList = useRecoilValue(companyListAtom)
  const [pltData, setPltData] = useRecoilState(plottingDataAtom)
  const [textPrompt, setPrompt] = useRecoilState(textPromptAtom)
  const [suggestions, setSuggestion] = useRecoilState(suggestionsAtom)
  const [counterCompany, setCounterCompany] = useRecoilState(counterCompanyAtom)
  const [_secReport, setSECReports] = useRecoilState(secReportsAtom)
  const [valueTicker, setValueTicker] = useRecoilState(valueTickerAtom)
  const loadingSuggestion = companyList.length === 0
  const [inputValueTicker, setInputValueTicker] =
    useRecoilState(inputValueTickerAtom)
  const _formCustomMethods = useForm({ mode: 'onBlur' })
  // Handling errors for user input
  let errors = ''

  // counterArr keeps track of the number of searchbars
  // Users can add and remove searchbars in order to search for multiple companies
  // They cannot compare more than 5 companies simultaneously
  // The minimum number of searchbars is 1
  let counterArr = new Array(counterCompany).fill('').map((_, i) => i + 1)

  const increaseCounter = () => {
    if (counterCompany < 5) {
      setValueTicker((currentState) => [...currentState, ''])
      setInputValueTicker((currentState) => [...currentState, ''])
      setCounterCompany(counterCompany + 1)
      counterArr = new Array(counterCompany).fill('').map((_, i) => i + 1)
    }
  }

  const decreaseCounter = () => {
    if (counterCompany > 1) {
      // remove the last item from the array
      setCalledCompanies((currentState) => currentState.slice(0, -1))
      setValueTicker(valueTicker.slice(0, -1))
      setInputValueTicker(inputValueTicker.slice(0, -1))
      setCounterCompany(counterCompany - 1)
      counterArr = new Array(counterCompany).fill('').map((_, i) => i + 1)
      var plotData = JSON.parse(JSON.stringify(pltData))
      // Only remove it if there is more than one company in the plotData
      if (plotData['netIncome']) {
        // passing (counterCompany - 1) since js array starts at index 0
        plotData = popCompany(plotData, counterCompany - 1)
        setPltData(plotData)
      }
    } else if (counterCompany === 1) {
      setCalledCompanies([])
      setValueTicker([''])
      setInputValueTicker([''])
      plotData = JSON.parse(JSON.stringify(pltData))
      if (plotData['netIncome']) {
        // passing (counterCompany - 1) since js array starts at index 0
        plotData = popCompany(plotData, counterCompany - 1)
        setPltData(plotData)
      }
      // Resetting the items inside the autocomplete searchbar
      // This is kind of hacky but it works
      const autoCompleteClear = document.getElementsByClassName(
        'MuiAutocomplete-clearIndicator'
      )[0]
      if (autoCompleteClear) {
        autoCompleteClear.click()
      }
    }
  }

  // Spit out list of companies as the user types in the searchbar
  const onChangeTextField = async (inputPrompt) => {
    if (inputPrompt.length > 0) {
      setPrompt(inputPrompt)
      let matches = companyList
      matches = matches.filter((res) => {
        const regex = new RegExp(`${inputPrompt}`, 'gi')
        return res.name.match(regex) || res.symbol.match(regex)
      })

      // Filter the matches so that they don't contain the same company twice
      matches = [
        ...new Map(matches.map((item) => [item['name'], item])).values(),
      ]
      setSuggestion(matches)
    }
  }

  // Query the API for financial data of a company that the user has selected
  const [getFunamentals, { _called, loading, _data }] =
    useLazyQuery(COMPANY_QUERY)

  const myChangeFunc = async (_event, values, reason, _details, index) => {
    // If the user has selected a company(selectOption), then query the API
    // for the financial data. And if the user has removed the company(clear),
    // then remove the company from the plotData
    var tmpValue = [...valueTicker]
    tmpValue[index] = values
    setValueTicker(tmpValue)
    let plotData
    if (reason === 'selectOption') {
      if (
        Object.keys(pltData).length != 0 &&
        pltData['netIncome']['nameCompany'].includes(values.name)
      ) {
        errors = 'Company already added, pick another company'
        return
      }
      // Add this company to the list of companies that has been called
      setCalledCompanies((currentState) => [...currentState, values])
      getFunamentals({
        variables: { ticker: values.symbol },
      }).then((fundamentalanalysis) => {
        plotData = JSON.parse(JSON.stringify(pltData))
        plotData = postProcess(
          fundamentalanalysis.data.getFundamentals,
          plotData,
          index
        )
        // Clean up the SEC report data and save it as an object
        // The format of the report will be
        /*
        {
          'APPLE': {'10K': { 'link':[l1, l2, ...],
                              'fillingDate': [d1, d2, ...]
                            },
                    '10Q': { 'link':[l1, l2, ...],
                              'fillingDate': [d1, d2, ...],
                          },
                    },
          'GOOGLE': {'10K': { 'link':[l1, l2, ...]
                              'fillingDate': [d1, d2, ...]
                            },
                    '10Q': { 'link':[l1, l2, ...],
                              'fillingDate': [d1, d2, ...],
                          },
                    },

        }
        */
        const tmpSECReports =
          fundamentalanalysis.data.getFundamentals.secReports
        const secReportCompany = {}
        for (let i = 0; i < tmpSECReports.length; i++) {
          if (tmpSECReports[i].type in secReportCompany) {
            secReportCompany[tmpSECReports[i].type].push({
              link: tmpSECReports[i]['finalLink'],
              fillingDate: tmpSECReports[i]['fillingDate'],
            })
          } else {
            secReportCompany[tmpSECReports[i].type] = [
              {
                link: tmpSECReports[i]['finalLink'],
                fillingDate: tmpSECReports[i]['fillingDate'],
              },
            ]
          }
        }
        setSECReports((secReport) => ({
          ...secReport,
          [plotData['netIncome']['nameCompany'].slice(-1)]: secReportCompany,
        }))
        setPltData(plotData)
      })
    } else if (reason === 'clear') {
      plotData = JSON.parse(JSON.stringify(pltData))
      plotData = popCompany(plotData, index)
      setPltData(plotData)
    }
  }

  // The following is kind of hacky, it should be refactored
  // Actually I hate doing it this way
  useEffect(() => {
    setLoading(loading)
  }, [setLoading, loading])

  return (
    // <>
    //   <Form
    //     formMethods={formCustomMethods}
    //     // error={error}
    //     // onSubmit={submitTicker}
    //     style={{ fontSize: '2rem' }}
    //   >
    <>
      <div className="searchbar-company">
        {counterArr.map((item, index) => (
          <Autocomplete
            key={index}
            freeSolo // for removing the dropdown arrow
            onBlur={() => {
              setTimeout(() => {
                setPrompt(textPrompt)
                setSuggestion([])
              }, 100)
            }}
            value={valueTicker[index] || null}
            inputValue={inputValueTicker[index]}
            onChange={(event, values, reason, details) =>
              myChangeFunc(event, values, reason, details, index)
            }
            onInputChange={(_e, newInputValue) => {
              var tmpInputValue = [...inputValueTicker]
              tmpInputValue[index] = newInputValue
              setInputValueTicker(tmpInputValue)
            }}
            sx={{ width: 1000 }}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            options={suggestions}
            getOptionLabel={(option) => `${option.name} (${option.symbol})`}
            renderInput={(params) => {
              return (
                <TextField
                  className="text-field-searchbar"
                  onChange={(e) => onChangeTextField(e.target.value)}
                  {...params}
                  variant="standard"
                  fullWidth
                  // placeholder="Enter Company Name"
                  label="Type Company Name"
                  error={errors ? true : false}
                  helperText={errors}
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <React.Fragment>
                        {loadingSuggestion ? (
                          <CircularProgress color="inherit" size={20} />
                        ) : null}
                        {params.InputProps.endAdornment}
                      </React.Fragment>
                    ),
                  }}
                />
              )
            }}
          />
        ))}

        {/* // </Form> */}

        <Tooltip title="Add Company">
          <button
            className="rounded-lg w-8 h-8 bg-lightsky-blue border border-gray-300 text-white text-xs cursor-pointer ml-1 mt-4"
            name="comparisonMode"
            onClick={increaseCounter}
          >
            +
          </button>
        </Tooltip>

        <Tooltip title="Remove Company">
          <button
            className="rounded-lg w-8 h-8 bg-lightsky-blue border border-gray-300 text-white text-xs cursor-pointer ml-1"
            name="comparisonMode"
            onClick={decreaseCounter}
          >
            -
          </button>
        </Tooltip>
      </div>
    </>
  )
}
