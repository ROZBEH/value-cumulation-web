import React, { useState } from 'react'

import CircularProgress from '@mui/material/CircularProgress'

import axios from 'axios'

export const Finchat = () => {
  const [loading, setLoading] = useState(false)
  const [logs, setLogs] = useState([])
  const [result, setResult] = useState(null)
  const [query, setQuery] = useState('')

  const getAnswer = () => {
    setLoading(true)
    setResult(null)
    axios
      .get('http://127.0.0.1:5000/answer_financial_queries', {
        headers: {
          VALUE_CUMULATION_API_KEY: process.env.VALUE_CUMULATION_API_KEY,
        },
        params: {
          query: query,
          ticker: 'AAPL', // we're not changing this for now
        },
      })
      .then((response) => {
        setResult(response.data.response)
        setLoading(false)
        setLogs([])
      })
      .catch((error) => {
        console.error(`Error: ${error}`)
        setLoading(false)
      })

    // Start getting logs once query is submitted
    const intervalId = setInterval(getLogs, 1000)

    // Clear interval when done
    setTimeout(() => {
      clearInterval(intervalId)
    }, 10000) // Adjust this value to determine how long the logs will be fetched
  }

  const getLogs = () => {
    axios
      .get('http://127.0.0.1:5000/logs', {
        headers: {
          VALUE_CUMULATION_API_KEY: process.env.VALUE_CUMULATION_API_KEY,
        },
      })
      .then((response) =>
        setLogs((prevLogs) => [...prevLogs, ...response.data.logs])
      )
      .catch((error) => console.error(`Error: ${error}`))
  }

  const handleQueryChange = (event) => {
    setQuery(event.target.value)
  }

  return (
    <div>
      <div>
        <input
          className="shadow appearance-none border-1 rounded h-16 w-1/2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          value={query}
          onChange={handleQueryChange}
          id="username"
          type="text"
          placeholder="Enter your query"
        ></input>

        <button
          className="rounded-lg w-20 h-8 bg-lightsky-blue border border-gray-300 text-white cursor-pointer ml-1"
          onClick={getAnswer}
          disabled={loading}
        >
          Submit
        </button>
      </div>
      {loading && logs.length > 0 && (
        <div>
          <CircularProgress color="inherit" size={20} />
          {logs.map((log, index) => (
            <div key={index}>{log}</div>
          ))}
        </div>
      )}
      {result && <div>{result}</div>}
    </div>
  )
}
