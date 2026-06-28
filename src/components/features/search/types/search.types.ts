export type SearchSuggestionType = 'category' | 'ad'

export interface SearchSuggestion {
  id: string
  type: SearchSuggestionType
  rawName: string
  name: string
  url: string
}
