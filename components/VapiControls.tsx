'use client'

import useVapi from '@/app/(root)/hooks/useVapi'
import { IBook } from '@/types'
import { Mic, MicOff } from 'lucide-react'
import React from 'react'
import Transcript from './Transcript'

const VapiControls = ({ book} : { book: IBook }) => {
  const { status, isActive, messages, currentMessage, currentUserMessage, duration, start, stop, clearErrors } = useVapi(book)
  return (
    <>
      <div className="max-w-4xl mx-auto space-y-6 ">
        {/* Header card */}
        <div className="vapi-header-card">
          <div className="flex items-center gap-6">
            {/* Book cover with mic button */}
            <div className="relative">
              <img
                src={book.coverURL || "/default-cover.jpg"}
                alt={book.title}
                className="w-30 h-auto rounded-lg shadow-lg"
              />
              {(isActive && (status === 'speaking' || status === 'thinking')) && (
                <div className="vapi-pulse-ring"></div>
              )}
              <button onClick={isActive ? stop : start} disabled={status==='connecting'} className="vapi-mic-btn absolute -bottom-3 -right-3">
                {isActive ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
              </button>
            </div>

            {/* Book info */}
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-bold font-serif mb-2">
                {book.title}
              </h1>
              <p className="text-lg text-gray-600 mb-4">
                by {book.author}
              </p>

              {/* Badges */}
              <div className="flex gap-2">
                <div className="vapi-status-indicator">
                  <div className="vapi-status-dot vapi-status-dot-ready"></div>
                  <span className="vapi-status-text">Ready</span>
                </div>
                <div className="bg-white px-3 py-1 rounded-full text-sm font-medium">
                  Voice: {book.persona}
                </div>
                <div className="bg-white px-3 py-1 rounded-full text-sm font-medium">
                  0:00/15:00
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Transcript below header card */}
        <Transcript 
          messages={messages} 
          currentMessage={currentMessage}
          currentUserMessage={currentUserMessage}
        />
      </div>

    </>
  )
}

export default VapiControls