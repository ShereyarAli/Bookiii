'use client'

import { Mic } from 'lucide-react'
import React, { useEffect, useRef } from 'react'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface TranscriptProps {
  messages: Message[]
  currentMessage?: string
  currentUserMessage?: string
}

const Transcript = ({ messages, currentMessage, currentUserMessage }: TranscriptProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, currentMessage, currentUserMessage])

  const isEmpty = messages.length === 0 && !currentMessage && !currentUserMessage

  if (isEmpty) {
    return (
      <div className="transcript-container">
        <div className="transcript-empty">
          <Mic className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <div className="transcript-empty-text">No conversation yet</div>
          <div className="transcript-empty-hint">
            Click the mic button above to start talking
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="vapi-transcript-wrapper">
      <div className="transcript-container">
        <div className="transcript-messages">
          {/* Render all messages */}
          {messages.map((message, index) => (
            <div
              key={`message-${index}`}
              className={`transcript-message ${
                message.role === 'user' ? 'transcript-message-user' : 'transcript-message-assistant'
              }`}
            >
              <div
                className={`transcript-bubble ${
                  message.role === 'user' ? 'transcript-bubble-user' : 'transcript-bubble-assistant'
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}

          {/* Render current streaming user message */}
          {currentUserMessage && (
            <div className="transcript-message transcript-message-user">
              <div className="transcript-bubble transcript-bubble-user">
                {currentUserMessage}
                <span className="transcript-cursor"></span>
              </div>
            </div>
          )}

          {/* Render current streaming assistant message */}
          {currentMessage && (
            <div className="transcript-message transcript-message-assistant">
              <div className="transcript-bubble transcript-bubble-assistant">
                {currentMessage}
                <span className="transcript-cursor"></span>
              </div>
            </div>
          )}

          {/* Auto-scroll anchor */}
          <div ref={messagesEndRef} />
        </div>
      </div>
    </div>
  )
}

export default Transcript
