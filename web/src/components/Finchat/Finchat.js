import React, { useState } from 'react'

import axios from 'axios'

export const Finchat = () => {
  const [loading, setLoading] = useState(false)
  const [logs, setLogs] = useState([])
  const [result, setResult] = useState(null)
  const [query, setQuery] = useState('')

  const getAnswer = () => {
    setLoading(true)
    axios
      .get('http://127.0.0.1:5000/answer_financial_queries', {
        headers: {
          VALUE_CUMULATION_API_KEY: process.env.VALUE_CUMULATION_API_KEY,
        },
        params: {
          query: query,
          ticker: 'QCOM', // we're not changing this for now
        },
      })
      .then((response) => {
        setResult(response.data.response)
        setLoading(false)
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
      <input
        className="shadow appearance-none border-1 rounded h-16 w-1/2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        value={query}
        onChange={handleQueryChange}
        id="username"
        type="text"
        placeholder="Enter your query"
      ></input>

      <div>
        <button className="py-3" onClick={getAnswer} disabled={loading}>
          {loading ? 'Loading...' : 'Submit'}
        </button>
      </div>

      {result && <div>Answer: {result}</div>}

      {logs.length > 0 && (
        <div>
          <h3>Logs</h3>
          <ul>
            {logs.map((log, index) => (
              <li key={index}>{log}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
