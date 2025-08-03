import React, { useState, useCallback } from 'react'
import styles from './SearchInput.module.css'

interface SearchInputProps {
  onSearch: (query: string) => void
  placeholder?: string
  className?: string
}

const SearchInput: React.FC<SearchInputProps> = ({ 
  onSearch, 
  placeholder = "Search videos...", 
  className = '' 
}) => {
  const [query, setQuery] = useState('')
  const [isFocused, setIsFocused] = useState(false)

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)
    onSearch(value)
  }, [onSearch])

  const clearSearch = useCallback(() => {
    setQuery('')
    onSearch('')
  }, [onSearch])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      clearSearch()
    }
  }

  return (
    <div className={`${styles.container} ${isFocused ? styles.focused : ''} ${className}`}>
      <div className={styles.searchIcon}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M21 21L16.514 16.506L21 21ZM19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={styles.input}
        spellCheck={false}
      />
      
      {query && (
        <button
          onClick={clearSearch}
          className={styles.clearButton}
          aria-label="Clear search"
          type="button"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M18 6L6 18M6 6L18 18"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      )}
    </div>
  )
}

export default SearchInput