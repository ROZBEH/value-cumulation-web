import React, { useState } from 'react'

import CircularProgress from '@mui/material/CircularProgress'
import axios from 'axios'

export const Finchat = () => {
  const [loading, setLoading] = useState(false)
  const [chatHistory, setChatHistory] = useState([])
  const [query, setQuery] = useState('')

  const getAnswer = (event) => {
    event.preventDefault() // This will prevent the page from refreshing
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
    <div className="flex flex-col h-screen">
      <div className="overflow-y-auto flex-grow p-4">
        {chatHistory.map((chat, index) => (
          <div key={index}>
            <span className={chat.type === 'user' ? 'font-bold' : ''}>
              {chat.message}
            </span>
          </div>
        ))}
      </div>
      <div className="p-4 flex justify-center bg-gray-200 sticky bottom-0">
        <form onSubmit={getAnswer} className="flex w-3/5">
          <input
            value={query}
            onChange={handleQueryChange}
            id="username"
            type="text"
            placeholder="Enter your query"
            className="flex-grow mr-2 py-2 px-4 rounded border-2 border-gray-300"
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Submit
          </button>
        </form>
      </div>
      {loading && (
        <div>
          <CircularProgress color="inherit" size={20} />
        </div>
      )}
    </div>
  )
}
