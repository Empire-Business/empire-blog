'use client'

import { Search } from 'lucide-react'
import { useState } from 'react'

interface SearchBarProps {
  placeholder?: string
  onSearch?: (query: string) => void
  suggestions?: string[]
}

export function SearchBar({ placeholder = 'Buscar...', onSearch, suggestions = [] }: SearchBarProps) {
  const [query, setQuery] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)

  const filteredSuggestions = suggestions.filter(s =>
    s.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 5)

  const handleSearch = (value: string) => {
    setQuery(value)
    onSearch?.(value)
    setShowSuggestions(false)
  }

  const handleSuggestionClick = (suggestion: string) => {
    handleSearch(suggestion)
  }

  return (
    <div className="relative w-full">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <input
          type="text"
          value={query}
          onChange={e => {
            setQuery(e.target.value)
            setShowSuggestions(true)
          }}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              handleSearch(query)
            }
          }}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
        />
      </div>

      {showSuggestions && query.length > 0 && filteredSuggestions.length > 0 && (
        <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
          <ul className="divide-y divide-gray-100">
            {filteredSuggestions.map((suggestion, index) => (
              <li
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-sm text-gray-700"
              >
                {suggestion}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
