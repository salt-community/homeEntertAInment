import React from 'react'

interface NewQuizButtonProps {
  onClick?: () => void
  disabled?: boolean
  className?: string
}

export default function NewQuizButton({ 
  onClick, 
  disabled = false,
  className = ''
}: NewQuizButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        px-6 py-3 
        bg-gradient-to-r from-blue-600 to-purple-600 
        text-white font-semibold 
        rounded-lg shadow-md 
        hover:from-blue-700 hover:to-purple-700 
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed
        transition-all duration-200 ease-in-out
        transform hover:scale-105 active:scale-95
        ${className}
      `}
    >
      🎯 Create New Quiz
    </button>
  )
}
