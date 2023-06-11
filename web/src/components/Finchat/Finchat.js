import React, { useEffect, useRef, useState } from 'react'

import SendIcon from '@mui/icons-material/Send'
import CircularProgress from '@mui/material/CircularProgress'
import axios from 'axios'
import { useRecoilState } from 'recoil'

import {
  setLoading as setLoadingAtom,
  setChatHistory as setChatHistoryAtom,
  setQuery as setQueryAtom,
} from 'src/recoil/atoms'

export const Finchat = () => {
  const [loading, setLoading] = useRecoilState(setLoadingAtom)
  const [chatHistory, setChatHistory] = useRecoilState(setChatHistoryAtom)
  const [query, setQuery] = useRecoilState(setQueryAtom)

  const [chatContainer, setChatContainer] = useState(null)
  const scrollContainerRef = useRef(null)

  useEffect(() => {
    if (scrollContainerRef.current) {
      setChatContainer(scrollContainerRef.current)
    }
  }, [])

  useEffect(() => {
    if (chatContainer) {
      // create observer
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.addedNodes.length) {
            const latestChat =
              mutation.addedNodes[mutation.addedNodes.length - 1]
            if (latestChat) {
              const rect = latestChat.getBoundingClientRect()
              if (rect.bottom > window.innerHeight || rect.top < 0) {
                latestChat.scrollIntoView({
                  behavior: 'smooth',
                  block: 'end',
                })
              }
            }
          }
        })
      })

      // start observing
      observer.observe(chatContainer, {
        childList: true,
      })

      // cleanup
      return () => observer.disconnect()
    }
  }, [chatContainer])

  const getAnswer = (event) => {
    event.preventDefault() // This will prevent the page from refreshing
    setLoading(true)
    setChatHistory((prevHistory) => [
      ...prevHistory,
      { message: query, type: 'user' },
    ])
    setQuery('')

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
          { message: response.data.response, type: 'bot' },
        ])
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
      <div ref={scrollContainerRef} className="flex-grow p-4">
        {chatHistory.map((chat, index) => (
          <div key={index}>
            <span className={chat.type === 'user' ? 'font-bold' : ''}>
              {chat.message}
            </span>
          </div>
        ))}
        {loading && (
          <div className="flex space-x-2 mt-2">
            <div className="w-1 h-1 bg-gray-500 rounded-full animate-bounce delay-500"></div>
            <div className="w-1 h-1 bg-gray-500 rounded-full animate-bounce delay-600"></div>
            <div className="w-1 h-1 bg-gray-500 rounded-full animate-bounce delay-700"></div>
          </div>
        )}
      </div>
      <div className="p-4 flex justify-center bg-gray-700 sticky bottom-0 rounded-xl">
        <form onSubmit={getAnswer} className="flex w-3/5">
          <div className="relative flex-grow mr-2">
            <input
              value={query}
              onChange={handleQueryChange}
              type="text"
              placeholder="Enter your query"
              className="w-full py-2 px-4 rounded border-2 border-gray-300 pl-10"
              autoComplete="off"
              // key={Date.now()}
            />
            {loading && (
              <CircularProgress
                className="absolute right-4 top-2"
                size={20}
                color="secondary"
              />
            )}
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-green-300 hover:bg-green-500 text-white font-bold py-2 px-4 rounded"
          >
            <SendIcon />
          </button>
        </form>
      </div>
    </div>
  )
}
