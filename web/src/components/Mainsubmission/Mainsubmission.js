import {
  Form,
  Submit,
  useForm,
  // TextField
  TextField as RwTextField,
} from '@redwoodjs/forms'
import { TextField } from '@material-ui/core'
import Autocomplete from '@mui/material/Autocomplete'
import Chip from '@material-ui/core/Chip'
import { useLazyQuery } from '@apollo/client'
import { useRecoilState, useRecoilValue } from 'recoil'
import {
  calledCompanies as calledCompaniesAtom,
  loadingFinancials as loadingFinancialsAtom,
  companyList as companyListAtom,
  plottingData as plottingDataAtom,
  suggestions as suggestionsAtom,
  textPrompt as textPromptAtom,
  counterCompany as counterCompanyAtom,
} from 'src/recoil/atoms'
import './Mainsubmission.css'
import { popCompany, postProcess } from './utilitiesMainsubmission'
import { useEffect } from 'react'

export const QUERY2 = gql`
  query GetFundamentalQuery($ticker: String!) {
    getFundamentals(ticker: $ticker) {
      companyName
      metricNames
      fullMetricNames
      metricValues
      years
    }
  }
`

export const Mainsubmission = () => {
  const [calledCompanies, setCalledCompanies] =
    useRecoilState(calledCompaniesAtom)
  const [_loadingFinancials, setLoading] = useRecoilState(loadingFinancialsAtom)
  const companyList = useRecoilValue(companyListAtom)
  const [pltData, setPltData] = useRecoilState(plottingDataAtom)
  const [textPrompt, setPrompt] = useRecoilState(textPromptAtom)
  const [suggestions, setSuggestion] = useRecoilState(suggestionsAtom)
  const [counterCompany, setCounterCompany] = useRecoilState(counterCompanyAtom)
  const formCustomMethods = useForm({ mode: 'onBlur' })

  // counterArr keeps track of the number of searchbars
  // Users can add and remove searchbars in order to search for multiple companies
  // They cannot compare more than 5 companies simultaneously
  // The minimum number of searchbars is 1
  let counterArr = new Array(counterCompany).fill('').map((_, i) => i + 1)

  const increaseCounter = () => {
    if (counterCompany < 5) {
      setCounterCompany(counterCompany + 1)
      counterArr = new Array(counterCompany).fill('').map((_, i) => i + 1)
    }
  }

  const decreaseCounter = () => {
    if (counterCompany > 1) {
      setCounterCompany(counterCompany - 1)
      counterArr = new Array(counterCompany).fill('').map((_, i) => i + 1)
      var plotData = JSON.parse(JSON.stringify(pltData))
      // Only remove it if there is more than one company in the plotData
      if (plotData['netIncome']) {
        // passing (counterCompany - 1) since js array starts at index 0
        plotData = popCompany(plotData, counterCompany - 1)
        setPltData(plotData)
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
    } else {
      setSuggestion([])
      setPrompt(inputPrompt)
    }
  }

  // Query the API for financial data of a company that the user has selected
  const [getFunamentals, { _called, loading, _data }] = useLazyQuery(QUERY2)

  const myChangeFunc = async (_event, values, reason, _details, index) => {
    // If the user has selected a company(selectOption), then query the API
    // for the financial data. And if the user has removed the company(clear),
    // then remove the company from the plotData
    let plotData
    if (reason === 'selectOption') {
      if (
        Object.keys(pltData).length != 0 &&
        pltData['netIncome']['nameCompany'].includes(values.name)
      ) {
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
        setPltData(plotData)
      })
    } else if (reason === 'clear') {
      plotData = JSON.parse(JSON.stringify(pltData))
      plotData = popCompany(plotData, index)
      setPltData(plotData)
    }
  }

  const textBoxStyle = {
    width: '25%',
    float: 'left',
    marginRight: '10px',
  }

  const searchBarStyle = {
    // display: 'flex',
    marginBottom: '80px',
    marginTop: '50px',
    marginLeft: '10px',
    // float: 'left',
  }

  const buttonStyle = () => ({
    backgroundColor: '#00BFFF', //lightskyblue
    marginLeft: '5px',
    borderRadius: '8px',
    border: 'none',
    padding: '6px 36px',
    cursor: 'pointer',
  })

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
      <div style={searchBarStyle}>
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
            onChange={(event, values, reason, details) =>
              myChangeFunc(event, values, reason, details, index)
            }
            isOptionEqualToValue={(option, value) => option.id === value.id}
            options={suggestions}
            getOptionLabel={(option) => `${option.name} (${option.symbol})`}
            renderInput={(params) => {
              return (
                <TextField
                  style={textBoxStyle}
                  onChange={(e) => onChangeTextField(e.target.value)}
                  {...params}
                  variant="standard"
                  fullWidth
                  placeholder="Type Company Name"
                />
              )
            }}
          />
        ))}

        {/* // </Form> */}

        <button
          // style={{ clear: 'block' }}
          style={buttonStyle()}
          name="comparisonMode"
          onClick={increaseCounter}
        >
          {' '}
          Add Company
        </button>

        <button
          // style={{ display: 'block' }}
          name="comparisonMode"
          onClick={decreaseCounter}
          style={buttonStyle()}
        >
          {' '}
          Remove Company
        </button>
      </div>
    </>
  )
}
