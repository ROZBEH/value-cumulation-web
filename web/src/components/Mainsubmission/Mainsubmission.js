import {
  Form,
  Submit,
  useForm,
  // TextField
  TextField as RwTextField,
} from '@redwoodjs/forms'
// import { Button, Icon, TextField, Paper, Typography } from '@material-ui/core'
import { TextField } from '@material-ui/core'
import classNames from 'classnames'
import Autocomplete from '@mui/material/Autocomplete'
import { makeStyles } from '@mui/styles'
import Chip from '@material-ui/core/Chip'
import {
  plottingData,
  suggestions as suggestionsAtom,
  textPrompt as textPromptAtom,
  ticker as tickerA,
  name as nameA,
  counterCompany as counterCompanyA,
} from 'src/recoil/atoms'
import { useLazyQuery } from '@apollo/react-hooks'
export const QUERY = gql`
  query SearchBarQuery($input: String!) {
    searchbar(input: $input) {
      symbol
      name
      price
      exchange
      exchangeShortName
      type
    }
  }
`

export const QUERY2 = gql`
  query GetFundamentalQuery($ticker: String!) {
    fundamentalanalysis: getSingleMetric(ticker: $ticker) {
      company_name
      metric_names
      full_metric_names
      metric_value
      years
    }
  }
`

import { useRecoilState } from 'recoil'
import './Mainsubmission.css'

const popCompany = (plotData, index) => {
  let company
  for (const metric in plotData) {
    if (plotData[metric]['nameCompany'].length === 1) {
      return {}
    }
    if (index) {
      company = plotData[metric]['nameCompany'].splice(index, 1)[0]
      console.log('company = ', company)
    } else {
      company = plotData[metric]['nameCompany'].pop()
    }
    for (const companyName in plotData[metric]['data']) {
      if (companyName === company) {
        plotData[metric]['data'].splice(companyName, 1)
      }
    }
  }
  return plotData
}

const postProcess = (data, plotData) => {
  const nameCompany = data.company_name
  const result = data.metric_value
  const fullMetricNames = data.full_metric_names
  const metrics = data.metric_names
  const years = data.years
  // Brining the data into the correct format for the rechart
  // Data format for plotData is in the following format:
  // {
  //    'netIncome': { 'metricName':'Net Income',
  //                'nameCompany': ['Apple Inc.', 'Tesla Inc.'],
  //                'data': { 'Apple Inc.': [{ 'name': '2020', 'value': 110 }, { 'name': '2021', 'value': 200 }],
  //                          'Tesla Inc.': [{ 'name': '2020', 'value': 90 }, { 'name': '2021', 'value': 110 }] }
  //              }
  //    'freeCashflow': { 'metricName':'Free Cashflow',
  //                'nameCompany': ['Apple Inc.', 'Tesla Inc.'],
  //                'data': { 'Apple Inc.': [{ 'name': '2020', 'value': 110 }, { 'name': '2021', 'value': 220 }],
  //                          'Tesla Inc.': [{ 'name': '2020', 'value': 100 }, { 'name': '2021', 'value': 120 }] }
  //              }
  // }

  for (var i = 0; i < result.length; i++) {
    if (!(metrics[i] in plotData)) {
      plotData[metrics[i]] = {}
      plotData[metrics[i]]['metricName'] = fullMetricNames[i]
      plotData[metrics[i]]['nameCompany'] = [nameCompany]
    } else {
      plotData[metrics[i]]['nameCompany'].push(nameCompany)
    }

    if (!('data' in plotData[metrics[i]])) {
      plotData[metrics[i]]['data'] = result[i].map((item, index) => {
        return {
          name: years[i][index],
          [nameCompany]: item,
        }
      })
    } else {
      plotData[metrics[i]]['data'].map((item, index) => {
        item[nameCompany] = result[i][index]
        return item
      })
    }
  }
  return plotData
}
export const Mainsubmission = () => {
  const [pltData, setPltData] = useRecoilState(plottingData)
  const [ticker, setTicker] = useRecoilState(tickerA)
  const [, setName] = useRecoilState(nameA)
  const [text, setPrompt] = useRecoilState(textPromptAtom)
  const [suggestions, setSuggestion] = useRecoilState(suggestionsAtom)
  const [counterCompany, setCounterCompany] = useRecoilState(counterCompanyA)

  const formMethods = useForm({ mode: 'onBlur' })

  const submitTicker = (data) => {
    console.log(data)
    console.log('data.target = ', data.target)
    console.log('Object.values(data) = ', Object.values(data))
    formMethods.reset()
    setTicker(text)
    setName('')
  }

  let counterArr = new Array(counterCompany).fill('').map((_, i) => i + 1)
  const increaseCounter = () => {
    setCounterCompany(counterCompany + 1)
    counterArr = new Array(counterCompany).fill('').map((_, i) => i + 1)
  }

  const decreaseCounter = () => {
    if (counterCompany > 1) {
      setCounterCompany(counterCompany - 1)
      counterArr = new Array(counterCompany).fill('').map((_, i) => i + 1)
      var plotData = JSON.parse(JSON.stringify(pltData))
      plotData = popCompany(plotData, '')
      setPltData(plotData)
    }
  }

  const [getArticles, { _loading, _error, _data }] = useLazyQuery(QUERY)

  const onChangeTextField = async (textPrompt) => {
    console.log('this textPrompt = ', textPrompt)
    if (textPrompt.length > 0) {
      setPrompt(textPrompt)
      // let matches = []
      var jsonRes = await getArticles({ variables: { input: textPrompt } })

      let matches = jsonRes.data.searchbar
      matches = matches.filter((res) => {
        const regex = new RegExp(`${textPrompt}`, 'gi')
        return res.name.match(regex)
      })

      matches = [
        ...new Map(matches.map((item) => [item['name'], item])).values(),
      ]
      console.log(matches.length)
      setSuggestion(matches)
    } else {
      setSuggestion([])
      setPrompt(textPrompt)
      console.log('Emptying the suggestions')
    }
  }

  const textBox = {
    width: '30%',
    float: 'left',
    marginRight: '10px',
  }

  const [getFunamentals, { called, loading, data }] = useLazyQuery(QUERY2)
  const myChangeFunc = async (_event, values, reason, _details, index) => {
    console.log('here = ')
    if (reason === 'selectOption') {
      console.log('selected an option')
      var fundamentalanalysis = await getFunamentals({
        variables: { ticker: values.symbol },
      })
      console.log('fundamentalanalysis = ', fundamentalanalysis)
      var plotData = JSON.parse(JSON.stringify(pltData))
      plotData = postProcess(
        fundamentalanalysis.data.fundamentalanalysis,
        plotData
      )
      setPltData(plotData)
    } else if (reason === 'clear') {
      plotData = JSON.parse(JSON.stringify(pltData))
      plotData = popCompany(plotData, index)
      setPltData(plotData)
    }
  }
  return (
    <>
      <Form
        formMethods={formMethods}
        // error={error}
        onSubmit={submitTicker}
        style={{ fontSize: '2rem' }}
      >
        {/* {counterArr.map((item, index) => (
          <RwTextField
            value={text}
            key={index}
            name={'ticker' + item}
            placeholder="Stock Ticker"
            maxLength="10"
            onChange={(e) => onChangeTextField(e.target.value)}
            onBlur={() => {
              setTimeout(() => {
                setSuggestion([])
              }, 100)
            }}
          />
        ))} */}
        {counterArr.map((item, index) => (
          <Autocomplete
            key={index}
            freeSolo // for removing the dropdown arrow
            onBlur={() => {
              setTimeout(() => {
                setPrompt(text)
                setSuggestion([])
              }, 100)
            }}
            onChange={(event, values, reason, details) =>
              myChangeFunc(event, values, reason, details, index)
            }
            isOptionEqualToValue={(option, value) => option.id === value.id}
            options={suggestions}
            getOptionLabel={(option) => option.name}
            renderInput={(params) => {
              return (
                <TextField
                  style={textBox}
                  onChange={(e) => onChangeTextField(e.target.value)}
                  {...params}
                  variant="standard"
                  fullWidth
                  placeholder="Company Name"
                />
              )
            }}
          />
        ))}

        {/* <Submit
          style={{
            verticalAlign: 'middle',
          }}
        >
          Go
        </Submit> */}
      </Form>

      <button
        // style={{ clear: 'block' }}
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
      >
        {' '}
        Remove Company
      </button>
    </>
  )
}
