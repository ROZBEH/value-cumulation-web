/**
Value Cumulation
Copyright (c) 2022 Value Cumulation

Notice: All code and information in this repository is the property of Value Cumulation.
You are strictly prohibited from distributing or using this repository unless otherwise stated.
 */

import * as React from 'react'
import { useEffect } from 'react'

import { useLazyQuery } from '@apollo/client'
import { Tooltip, TextField } from '@material-ui/core'
import Autocomplete from '@mui/material/Autocomplete'
import CircularProgress from '@mui/material/CircularProgress'
import { useRecoilState, useRecoilValue } from 'recoil'

import {
  COMPANY_QUERY,
  GPT_QUERY_SECTOR,
  GPT_QUERY_SENTIMENT,
} from 'src/commons/gql'
import { popCompany, postProcess } from 'src/commons/processCompany'
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
  currentSearchBox as currentSearchBoxAtom,
} from 'src/recoil/atoms'
import { sectorCompanies as sectorCompaniesAtom } from 'src/recoil/sectorAtom'

import './Mainsubmission.css'

export const Mainsubmission = () => {
  const [calledCompanies, setCalledCompanies] =
    useRecoilState(calledCompaniesAtom)
  const [loadingFinancials, setLoading] = useRecoilState(loadingFinancialsAtom)
  const companyList = useRecoilValue(companyListAtom)
  const [pltData, setPltData] = useRecoilState(plottingDataAtom)
  const [textPrompt, setPrompt] = useRecoilState(textPromptAtom)
  const [suggestions, setSuggestion] = useRecoilState(suggestionsAtom)
  const [counterCompany, setCounterCompany] = useRecoilState(counterCompanyAtom)
  const [_secReport, setSECReports] = useRecoilState(secReportsAtom)
  const [valueTicker, setValueTicker] = useRecoilState(valueTickerAtom)
  const [inputValueTicker, setInputValueTicker] =
    useRecoilState(inputValueTickerAtom)
  const [sectorCompanies, setSectorCompanies] =
    useRecoilState(sectorCompaniesAtom)
  const loadingSuggestion = companyList.length === 0
  const [currentSearchBox, setCurrentSearchBox] =
    useRecoilState(currentSearchBoxAtom)
  const [getGPTResSector, { loading: loadingGPTSector }] = useLazyQuery(
    GPT_QUERY_SECTOR,
    {
      onCompleted: (data) => {
        // First filter the list of available companies for GPT suggestions
        // const tmpSectorComp = companyList.filter((company) =>
        //   data.gptIntelligence.response.some((res) => res === company.symbol)
        // )
        // Now set the list of sector companies
        const query = data.gptIntelligence.query
        if (data.gptIntelligence.error) {
          console.log(data.gptIntelligence.error)
        }
        setSectorCompanies((currentState) => {
          return { ...currentState, [query]: data.gptIntelligence.response }
        })
      },
      // notifyOnNetworkStatusChange: true,
      // fetchPolicy: 'network-only',
    }
  )

  const [getGPTResSentiment] = useLazyQuery(GPT_QUERY_SENTIMENT, {
    onCompleted: (_data) => {
      //pass
    },
  })
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
    let tmpSectorComp = { ...sectorCompanies }
    if (counterCompany > 1) {
      // remove the last item from the array
      if (valueTicker.slice(-1)[0] == null) {
        setCounterCompany(counterCompany - 1)
        setValueTicker(valueTicker.slice(0, -1))
        return
      }
      delete tmpSectorComp[valueTicker.slice(-1)[0].symbol]
      setSectorCompanies(tmpSectorComp)
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
      delete tmpSectorComp[valueTicker.slice(-1)[0].symbol]
      setSectorCompanies(tmpSectorComp)
      setCalledCompanies([])
      setValueTicker([''])
      setInputValueTicker([''])
      plotData = JSON.parse(JSON.stringify(pltData))
      if (plotData['netIncome']) {
        // passing (counterCompany - 1) since js array starts at index 0
        // plotData = popCompany(plotData, counterCompany - 1)
        // setPltData(plotData)
        setPltData({})
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
  const [getFunamentals, { loading: loadingFundamentals }] = useLazyQuery(
    COMPANY_QUERY,
    {
      onCompleted: async (fundamentalanalysis) => {
        // Add this company to the list of companies that has been called
        postProcess(
          fundamentalanalysis.getFundamentals,
          currentSearchBox,
          pltData,
          setPltData,
          setSECReports
        )
      },
    }
  )

  const myChangeFunc = async (_event, values, reason, _details, index) => {
    // If the user has selected a company(selectOption), then query the API
    // for the financial data. And if the user has removed the company(clear),
    // then remove the company from the plotData
    var tmpValue = [...valueTicker]
    tmpValue[index] = values
    setValueTicker(tmpValue)
    setCurrentSearchBox(index)
    let plotData

    if (reason === 'selectOption') {
      // Add this company to the list of companies that has been called
      // setCalledCompanies((currentState) => [...currentState, values])
      if (calledCompanies.some((obj) => obj.name === values.name)) {
        alert('Company already picked')
        return
      }
      setCalledCompanies((currentState) => {
        const newState = [...currentState]
        newState.splice(index, 0, values)
        return newState
      })
      getFunamentals({
        variables: { ticker: values.symbol },
      })
      getGPTResSector({
        variables: { query: values.symbol },
      })
      getGPTResSentiment({
        variables: { query: `I  didn't liked last years result` },
      })
    } else if (reason === 'clear') {
      // The user entered a company that there was no match for
      if (valueTicker.slice(-1)[0].symbol == null) {
        return
      }
      let tmpSectorComp = { ...sectorCompanies }
      delete tmpSectorComp[valueTicker[index].symbol]
      setSectorCompanies(tmpSectorComp)
      var tmpCalledCompanies = [...calledCompanies]
      tmpCalledCompanies.splice(index, 1)
      setCalledCompanies(tmpCalledCompanies)
      // Autocomplete value
      var tmpValueTicker = [...valueTicker]
      tmpValueTicker[index] = ''
      setValueTicker(tmpValueTicker)
      // Autocomplete Input value
      var tmpInputValueTicker = [...inputValueTicker]
      tmpInputValueTicker[index] = ''
      setInputValueTicker(tmpInputValueTicker)
      plotData = JSON.parse(JSON.stringify(pltData))
      plotData = popCompany(plotData, index)
      setPltData(plotData)
    }
  }

  // The following is kind of hacky, it should be refactored
  // Actually I hate doing it this way
  useEffect(() => {
    if (loadingFundamentals || loadingGPTSector) {
      setLoading(true)
    } else {
      setLoading(false)
    }
  }, [setLoading, loadingFundamentals, loadingGPTSector])

  return (
    <>
      <div className="searchbar-company">
        {counterArr.map((item, index) => (
          <Autocomplete
            noOptionsText="No company found"
            loading={loadingSuggestion}
            autoHighlight={true}
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
              setInputValueTicker((prevInputValue) => {
                const newArray = [...prevInputValue]
                newArray[index] = newInputValue
                return newArray
              })
            }}
            sx={{ width: 1000 }}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            options={suggestions}
            getOptionLabel={(option) => {
              if (option && option.name) {
                return `${option.name} (${option.symbol})`
              } else {
                errors = 'No company found. Pick a valid name or ticker'
                return ''
              }
            }}
            renderInput={(params) => {
              return (
                <TextField
                  className="text-field-searchbar"
                  onChange={(e) => onChangeTextField(e.target.value)}
                  {...params}
                  variant="standard"
                  fullWidth
                  label="Type Company Name or Ticker"
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
