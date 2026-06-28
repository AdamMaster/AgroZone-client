'use client'

import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'

import { searchService } from '../services/search.service'
import { SearchSuggestion } from '../types/search.types'

export function useSearch() {
  const [query, setQuery] = useState('')

  const {
    mutate: fetchSuggestions,
    data: suggestions = [],
    isPending: isLoading
  } = useMutation<SearchSuggestion[], unknown, string>({
    mutationKey: ['search suggestions'],

    mutationFn: (q: string) => searchService.getSuggestions(q)
  })

  const onSearch = (value: string) => {
    setQuery(value)
    fetchSuggestions(value)
  }

  return {
    query,
    setQuery,
    onSearch,
    suggestions,
    isLoading
  }
}
