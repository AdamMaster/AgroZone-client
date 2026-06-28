'use client'

import { Search } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'

import { Button, Input } from '@/components/ui'

import { cn } from '@/lib/utils'

import { useSearch } from '../hooks/use-search'

interface SearchBarProps {
  className?: string
}

export const SearchBar = ({ className }: SearchBarProps) => {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [isFocus, setIsFocus] = useState<boolean>(false)

  const { query, setQuery, onSearch, suggestions } = useSearch()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()

    if (!query.trim()) {
      router.push('/')
      return
    }

    router.push(`/?q=${encodeURIComponent(query.trim())}`)

    setIsFocus(false)

    const activeElement = document.activeElement as HTMLElement
    activeElement?.blur()
  }

  const handleInputChange = (value: string) => {
    setQuery(value)
    onSearch(value)
  }

  return (
    <div className={cn(className)}>
      <form
        className='relative z-100'
        onSubmit={handleSearch}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setTimeout(() => setIsFocus(false), 200)}
      >
        <Search className={cn('absolute top-[50%] left-6 size-5 translate-[-50%] text-gray-400')} />

        <Input
          value={query}
          placeholder='Поиск по объявлениям'
          onChange={e => handleInputChange(e.target.value)}
          className='h-12 pl-10 focus-visible:border-transparent'
        />

        <Button
          type='submit'
          variant='default'
          className='text-md absolute top-[50%] right-[2px] h-11 translate-y-[-50%] px-5 font-normal active:translate-y-[-50%]!'
        >
          Найти
        </Button>

        {isFocus && suggestions.length > 0 && (
          <div className='custom-shadow absolute top-[calc(100%+4px)] left-0 z-100 max-h-64 w-full overflow-hidden overflow-y-auto rounded-lg bg-white'>
            <div className='py-2'>
              {suggestions.map(item => (
                <div
                  key={item.id}
                  onClick={() => {
                    setQuery(item.name)
                    setIsFocus(false)

                    const activeElement = document.activeElement as HTMLElement
                    activeElement?.blur()

                    router.push(item.url)
                  }}
                  className='flex cursor-pointer items-center px-6 py-3 text-sm transition-colors hover:bg-gray-50'
                >
                  <Search className='mr-3 size-4 shrink-0 text-gray-400' />

                  <span className={item.type === 'category' ? 'font-medium text-green-600' : ''}>{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </form>

      {isFocus && <div className='fixed inset-0 z-50 h-full w-full bg-black/20' />}
    </div>
  )
}
