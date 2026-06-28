import { api } from '@/shared/api'

import { SearchSuggestion } from '../types'

class SearchService {
  private URL = 'search'

  async getSuggestions(q: string) {
    if (!q || q.trim().length < 2) return []

    const response = await api.get<SearchSuggestion[]>(`${this.URL}/suggestions`, {
      params: { q: q.trim() }
    })

    return response
  }
}

export const searchService = new SearchService()
