/**
Value Cumulation
Copyright (c) 2022 Value Cumulation

Notice: All code and information in this repository is the property of Value Cumulation.
You are strictly prohibited from distributing or using this repository unless otherwise stated.
 */

import * as React from 'react'
import { useEffect, useState } from 'react'

import { useLazyQuery } from '@apollo/client'
import { makeStyles, Chip, Tooltip, TextField } from '@material-ui/core'
import { CancelRounded } from '@material-ui/icons'
import Autocomplete from '@mui/material/Autocomplete'
import CircularProgress from '@mui/material/CircularProgress'
import classNames from 'classnames'
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
  secReports as secReportsAtom,
} from 'src/recoil/atoms'
import { sectorCompanies as sectorCompaniesAtom } from 'src/recoil/sectorAtom'

import './Mainsubmission.css'

export const Mainsubmission = () => {
  const [calledCompanies, setCalledCompanies] =
    useRecoilState(calledCompaniesAtom)
  const [_loadingFinancials, setLoading] = useRecoilState(loadingFinancialsAtom)
  const companyList = useRecoilValue(companyListAtom)
  const [pltData, setPltData] = useRecoilState(plottingDataAtom)
  const [textPrompt, setPrompt] = useRecoilState(textPromptAtom)
  const [suggestions, setSuggestion] = useRecoilState(suggestionsAtom)
  const [_secReport, setSECReports] = useRecoilState(secReportsAtom)
  const [value, _setValue] = useState(null)
  const [inputValue, setInputValue] = useState('')

  const [sectorCompanies, setSectorCompanies] =
    useRecoilState(sectorCompaniesAtom)
  const loadingSuggestion = companyList.length === 0
  const [getGPTResSector, { loading: loadingGPTSector }] = useLazyQuery(
    GPT_QUERY_SECTOR,
    {
      onCompleted: (data) => {
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
          pltData,
          setPltData,
          setSECReports
        )
      },
    }
  )

  const clearInput = () => {
    const autoCompleteClear = document.getElementsByClassName(
      'MuiAutocomplete-clearIndicator'
    )[0]

    if (autoCompleteClear) {
      autoCompleteClear.click()
    }
  }

  const myChangeFunc = async (_event, values, reason, _details) => {
    // If the user has selected a company(selectOption), then query the API
    // for the financial data. And if the user has removed the company(clear),
    // then remove the company from the plotData

    if (reason === 'clear') {
      clearInput()
      return
    }

    if (reason === 'selectOption') {
      // Add this company to the list of companies that has been called
      // setCalledCompanies((currentState) => [...currentState, values])
      if (calledCompanies.some((obj) => obj.name === values.name)) {
        alert('Company already picked')
        return
      }
      setCalledCompanies((currentState) => {
        const newState = [...currentState]
        newState.push(values)
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
      // setPrompt('')
      // setSuggestion([])
      clearInput()
    }
  }

  const updateUserPickedMetrics = (values, _getTagProps) => {
    {
      return values.map((option, index) => {
        return (
          <Chip
            key={index}
            size="medium"
            variant="outlined"
            classes={{
              root: classNames({
                [buttonColor.backgroundTag]: true,
              }),
            }}
            label={`${option.name} (${option.symbol})`}
            // {...getTagProps({ index })}
            deleteIcon={
              <Tooltip title="Remove Metric">
                <CancelRounded style={{ color: 'black' }} />
              </Tooltip>
            }
            onDelete={onDelete(option.name)}
          />
        )
      })
    }
  }

  const useStyles = makeStyles({
    backgroundTag: {
      backgroundColor: '#4f46e5 !important',
      fontFamily:
        '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
      color: 'white',
      fontWeight: 'bold',
    },
  })
  const buttonColor = useStyles()

  const onDelete = (name) => () => {
    const index = calledCompanies.findIndex((item) => item.name === name)
    const toBeRemoved = calledCompanies[index]
    const calledCompaniesLength = calledCompanies.length

    setCalledCompanies((value) => value.filter((v) => v.name !== name))
    // filtering out the company from the sectorCompanies

    const { [toBeRemoved.symbol]: _removedKey, ...remained } = sectorCompanies

    setSectorCompanies(remained)

    if (calledCompaniesLength == 1) {
      setPltData({})
      return
    }

    let plotData
    plotData = JSON.parse(JSON.stringify(pltData))
    plotData = popCompany(plotData, index)
    setPltData(plotData)
  }

  // The following is kind of hacky, it should be refactored
  // Actually I hate doing it this way
  useEffect(() => {
    if (loadingFundamentals || loadingGPTSector) {
      setLoading(true)
    } else {
      setLoading(false)
    }
  }, [setLoading, loadingFundamentals, loadingGPTSector, textPrompt])

  return (
    <>
      <div className="searchbar-company flex flex-row mt-5 mb-3">
        <Autocomplete
          clearIcon={
            <Tooltip title="Clear the entry">
              <CancelRounded />
            </Tooltip>
          }
          renderTags={() => null}
          // multiple
          onChange={(event, values, reason, details) =>
            myChangeFunc(event, values, reason, details)
          }
          filterSelectedOptions
          value={value}
          inputValue={inputValue}
          onInputChange={(event, newInputValue) => {
            setInputValue(newInputValue)
          }}
          options={suggestions}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          getOptionLabel={(option) => `${option.name} (${option.symbol})`}
          // value={valueTicker || null}
          // value={defaultVisiableOptions}
          // value={calledCompanies}
          noOptionsText="No company found"
          loading={loadingSuggestion}
          // defaultValue={calledCompanies}
          // value={''}
          autoHighlight={true}
          clearOnEscape={false}
          freeSolo // for removing the dropdown arrow
          // onBlur={() => {
          //   setTimeout(() => {
          //     setPrompt(textPrompt)
          //     setSuggestion([])
          //   }, 100)
          // }}
          // onInputChange={(event, value, reason) => {
          //   if (reason === 'clear') {
          //     clearInput()
          //   }
          // }}
          sx={{ width: 1360 }}
          // getOptionLabel={(option) => {
          //   if (option && option.name) {
          //     return `${option.name} (${option.symbol})`
          //   } else {
          //     errors = 'No company found. Pick a valid name or ticker'
          //     return ''
          //   }
          // }}
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
      </div>
      <div className="mb-10">{updateUserPickedMetrics(calledCompanies)}</div>
    </>
  )
}
