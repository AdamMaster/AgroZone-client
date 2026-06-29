'use client'

import { Search } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { Button, Input } from '@/components/ui'

import { cn } from '@/lib/utils'

import { useSearch } from '../hooks/use-search'

interface SearchBarProps {
  className?: string
}

export const SearchBar = ({ className }: SearchBarProps) => {
  const router = useRouter()

  const [isFocus, setIsFocus] = useState<boolean>(false)

  const { query, setQuery, onSearch, suggestions } = useSearch()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()

    const trimmed = query.trim()

    if (!trimmed) {
      router.push('/')
      return
    }

    const exact = suggestions.find(s => s.name.toLowerCase() === trimmed.toLowerCase())

    if (exact?.url) {
      router.push(exact.url)
    } else {
      router.push(`/search?q=${encodeURIComponent(trimmed)}`)
    }

    setIsFocus(false)
    ;(document.activeElement as HTMLElement)?.blur()
  }

  const handleInputChange = (value: string) => {
    console.log('INPUT:', value)
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
        <Search className={cn('absolute top-[50%] left-6 size-4 translate-[-50%] text-gray-400')} />

        <Input
          value={query}
          placeholder='Поиск по объявлениям'
          onChange={e => handleInputChange(e.target.value)}
          className='h-12 pl-10 focus-visible:border-transparent'
        />

        <Button
          type='submit'
          variant='default'
          className='text-md absolute top-[50%] right-[4px] h-10 translate-y-[-50%] px-5 font-normal text-white active:translate-y-[-50%]!'
        >
          Найти
        </Button>

        {isFocus && suggestions.length > 0 && (
          <div className='custom-shadow absolute top-[calc(100%+4px)] left-0 z-100 max-h-64 w-full overflow-hidden overflow-y-auto rounded-lg bg-white'>
            <div className='py-2'>
              {suggestions.map(item => (
                <ul
                  key={item.id}
                  onClick={() => {
                    setQuery(item.name)
                    setIsFocus(false)

                    const activeElement = document.activeElement as HTMLElement
                    activeElement?.blur()

                    router.push(item.url)
                  }}
                  className='flex cursor-pointer items-center px-4 py-3 text-sm transition-colors hover:bg-gray-100'
                >
                  {item.type === 'category' ? (
                    <li>
                      <span className='text-gray-500'>Категория: </span>
                      {item.name}
                    </li>
                  ) : (
                    <li>
                      <span>{item.name}</span>
                    </li>
                  )}
                </ul>
              ))}
            </div>
          </div>
        )}
      </form>

      {isFocus && <div className='fixed inset-0 z-50 h-full w-full bg-black/20' />}
    </div>
  )
}
