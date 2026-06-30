'use client'

import { ChevronRight, Search, X } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'

import { Button, Input } from '@/components/ui'

import { cn } from '@/lib/utils'

import { useSearch } from '../hooks/use-search'

interface SearchBarProps {
  className?: string
}

export const SearchBar = ({ className }: SearchBarProps) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [isFocus, setIsFocus] = useState<boolean>(false)

  const { query, setQuery, onSearch, suggestions } = useSearch()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()

    const trimmedQuery = query.trim()

    if (!trimmedQuery) {
      router.push('/catalog')
      return
    }

    router.push(`/catalog?search=${encodeURIComponent(trimmedQuery)}`)

    setIsFocus(false)

    const activeElement = document.activeElement as HTMLElement
    activeElement?.blur()
  }

  const handleInputChange = (value: string) => {
    setQuery(value)
    onSearch(value)
  }

  const onClear = () => {
    setQuery('')

    const params = new URLSearchParams(searchParams.toString())
    params.delete('search')

    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <div className={cn(className)}>
      <form
        className='relative z-100'
        onSubmit={handleSearch}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setTimeout(() => setIsFocus(false), 200)}
      >
        <Search
          className={cn(
            'absolute top-[50%] left-7 size-5 translate-[-50%] text-gray-400',
            query.length > 0 && 'text-inherit'
          )}
        />

        <Input
          value={query}
          placeholder='Поиск по объявлениям'
          onChange={e => handleInputChange(e.target.value)}
          className='h-12 pl-12 focus-visible:border-transparent'
          autoComplete='off'
        />

        <div className='absolute top-0 right-0 flex h-full items-center gap-4 p-[3px]'>
          {query.length > 0 && (
            <button type='button' onClick={() => onClear()}>
              <X className='size-5 text-gray-400 hover:text-inherit' />
            </button>
          )}
          <Button type='submit' variant='default' className='text-md h-full px-5 font-normal'>
            Найти
          </Button>
        </div>

        {isFocus && suggestions.length > 0 && (
          <div className='custom-shadow absolute top-[calc(100%+4px)] left-0 z-100 max-h-64 w-full overflow-hidden overflow-y-auto rounded-lg bg-white'>
            <ul className='py-2'>
              {suggestions.map(item => (
                <li
                  key={item.id}
                  onClick={() => {
                    setQuery(item.name)
                    setIsFocus(false)

                    const activeElement = document.activeElement as HTMLElement
                    activeElement?.blur()

                    router.push(item.url)
                  }}
                  className='flex cursor-pointer items-center gap-3 px-4 py-3 text-sm transition-colors hover:bg-gray-50'
                >
                  {item.type === 'category' ? (
                    <ChevronRight className='size-5 shrink-0' />
                  ) : (
                    <Search className='size-4 shrink-0' />
                  )}

                  <span>{item.name}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </form>

      {isFocus && <div className='fixed inset-0 z-50 h-full w-full bg-black/20' />}
    </div>
  )
}
