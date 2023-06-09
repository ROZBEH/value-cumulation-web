import React, { useState } from 'react'

import CircularProgress from '@mui/material/CircularProgress'
import axios from 'axios'

export const Finchat = () => {
  const [loading, setLoading] = useState(false)
  const [chatHistory, setChatHistory] = useState([])
  const [query, setQuery] = useState('')

  const getAnswer = () => {
    setLoading(true)

    axios
      .post(
        `${process.env.FLASK_API_URL}/answer_financial_queries`,
        {
          message: query,
        },
        {
          headers: {
            VALUE_CUMULATION_API_KEY: process.env.VALUE_CUMULATION_API_KEY,
          },
        }
      )
      .then((response) => {
        setChatHistory((prevHistory) => [
          ...prevHistory,
          { message: query, type: 'user' },
          { message: response.data.response, type: 'bot' },
        ])
        setQuery('')
        setLoading(false)
      })
      .catch((error) => {
        console.error(`Error: ${error}`)
        setLoading(false)
      })
  }

  const handleQueryChange = (event) => {
    setQuery(event.target.value)
  }

  return (
    <div>
      {chatHistory.map((chat, index) => (
        <div key={index}>
          <span
            style={{ fontWeight: chat.type === 'user' ? 'bold' : 'normal' }}
          >
            {chat.message}
          </span>
        </div>
      ))}
      <div>
        <input
          value={query}
          onChange={handleQueryChange}
          id="username"
          type="text"
          placeholder="Enter your query"
        />

        <button onClick={getAnswer} disabled={loading}>
          Submit
        </button>
      </div>
      {loading && (
        <div>
          <CircularProgress color="inherit" size={20} />
        </div>
      )}
    </div>
  )
}
