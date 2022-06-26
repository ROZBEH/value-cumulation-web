import {
  Form,
  Submit,
  useForm,
  TextField as RwTextField,
} from '@redwoodjs/forms'
import TextField from '@mui/material/TextField'
import classNames from 'classnames'
import Autocomplete from '@mui/material/Autocomplete'
import { makeStyles } from '@mui/styles'
import Chip from '@material-ui/core/Chip'
import {
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

import { useRecoilState } from 'recoil'
import './Mainsubmission.css'
import { useEffect } from 'react'
import { ContactSupport } from '@material-ui/icons'
import { alignProperty } from '@mui/material/styles/cssUtils'
export const Mainsubmission = () => {
  const [, setTicker] = useRecoilState(tickerA)
  const [, setName] = useRecoilState(nameA)
  const [text, setPrompt] = useRecoilState(textPromptAtom)
  const [suggestions, setSuggestion] = useRecoilState(suggestionsAtom)
  const [counterCompany, setCounterCompany] = useRecoilState(counterCompanyA)

  const formMethods = useForm({ mode: 'onBlur' })
  const submitTicker = (data) => {
    formMethods.reset()
    setTicker(Object.values(data))
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
    }
  }
  const onSuggestionHandler = (e) => {
    setTicker(e.symbol)
    // console.log(e)
  }
  const [getArticles, { _loading, _error, _data }] = useLazyQuery(QUERY)

  const onChangeTextField = async (textPrompt) => {
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
  const myChangeFunc = (event, values, reason, detail) => {
    if (reason === 'selectOption') {
      setTicker(values.symbol)
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
        {counterArr.map((item, index) => (
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
        ))}
        <Autocomplete
          onBlur={() => {
            setTimeout(() => {
              setPrompt(text)
              setSuggestion([])
            }, 100)
          }}
          onChange={myChangeFunc}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          // onInputChange={(event, _value, _reason) => {
          //   if (event && event.type === 'blur') {
          //     console.log('text = ', text)
          //     console.log('event = ', event.type)
          //     setPrompt(text)
          //     setSuggestion([])
          //   }
          // }}
          options={suggestions}
          getOptionLabel={(option) => option.name}
          // onChange={handleOptionsIdChange()}
          // multiple={true}
          renderInput={(params) => (
            <TextField
              style={textBox}
              onChange={(e) => onChangeTextField(e.target.value)}
              {...params}
              label=""
              variant="standard"
              fullWidth
              placeholder="Company Name"
            />
          )}
        />

        <Submit
          style={{
            verticalAlign: 'middle',
          }}
        >
          Go
        </Submit>
      </Form>
      <button name="comparisonMode" onClick={increaseCounter}>
        {' '}
        Add Company
      </button>
      <button name="comparisonMode" onClick={decreaseCounter}>
        {' '}
        Remove Company
      </button>
    </>
  )
}
