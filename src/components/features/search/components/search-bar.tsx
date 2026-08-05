'use client'

import { ChevronLeft, ChevronRight, Search, X } from 'lucide-react'
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

    setIsFocus(false)
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

  const onClickButton = () => {
    setIsFocus(false)
  }

  const onClickInput = () => {
    setIsFocus(true)
  }

  return (
    <div className={cn(className)}>
      <form className='bg-primary relative z-100 flex items-center rounded-lg p-[2px]' onSubmit={handleSearch}>
        <div className='relative w-full'>
          <Input
            value={query}
            placeholder='Поиск по объявлениям'
            onChange={e => handleInputChange(e.target.value)}
            onClick={() => onClickInput()}
            className='h-12 w-full rounded-[10px] border-0 pl-5 text-[15px]! focus-visible:border-transparent'
            autoComplete='off'
          />

          {query.length > 0 && (
            <button
              type='button'
              onClick={() => onClear()}
              className='absolute top-0 right-0 flex h-full items-center justify-center px-3'
            >
              <X className='size-5 text-gray-400 hover:text-inherit' />
            </button>
          )}
        </div>

        <Button
          type='submit'
          variant='default'
          className='text-md h-12! px-5 font-normal'
          onClick={() => onClickButton()}
        >
          <Search className={cn('size-5 text-white')} />
        </Button>

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
                  {item.type !== 'category' && <Search className='size-4 shrink-0' />}

                  <div className='flex items-center gap-1'>
                    <span className='font-medium'>{item.name}</span>
                    <ChevronRight className='size-4 shrink-0 text-gray-500' />
                    {item.type === 'category' && item.parentName && (
                      <span className='text-gray-500'>{item.parentName}</span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </form>

      {isFocus && <div className='fixed inset-0 z-50 h-full w-full bg-black/20' onClick={() => setIsFocus(false)} />}
    </div>
  )
}
