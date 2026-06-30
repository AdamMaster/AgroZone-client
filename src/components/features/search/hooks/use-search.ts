import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'

import { searchService } from '../services'
import { SearchSuggestion } from '../types'

export function useSearch() {
  const [query, setQuery] = useState('')
  // ⚡ Вводим стейт для отложенного значения
  const [debouncedQuery, setDebouncedQuery] = useState('')

  // ⚡ Эффект, который обновит debouncedQuery только через 300мс после того, как юзер перестал печатать
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query)
    }, 300) // 300 миллисекунд — золотой стандарт для поиска

    return () => clearTimeout(handler)
  }, [query])

  const { data: suggestions = [], isFetching: isLoading } = useQuery<SearchSuggestion[]>({
    // ⚡ В queryKey и queryFn теперь передаем именно задебаунсенное значение!
    queryKey: ['search', debouncedQuery],
    queryFn: () => searchService.getSuggestions(debouncedQuery),
    // Запрос сработает, только если очищенный от пробелов текст длиннее 2 символов
    enabled: debouncedQuery.trim().length >= 2
  })

  return {
    query,
    setQuery,
    // Если в SearchBar вызывался onSearch, мы просто прокидываем setQuery, чтобы ничего не сломать
    onSearch: setQuery,
    suggestions: query.trim().length < 2 ? [] : suggestions, // Скрываем старые подсказки, если юзер всё стёр
    isLoading
  }
}
