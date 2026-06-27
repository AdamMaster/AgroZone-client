'use client'

import { Search } from 'lucide-react'
import { useState } from 'react'

import { Button, Input } from '@/components/ui'

import { cn } from '@/lib/utils'

interface SearchBarProps {
  className?: string
}

export const SearchBar = ({ className }: SearchBarProps) => {
  const [isFocus, setIsFocus] = useState<boolean>(false)

  const onFocus = () => {
    setIsFocus(true)
  }

  const onBlur = () => {
    setIsFocus(false)
  }

  return (
    <div className={cn(className)}>
      <div className='relative z-100' onFocus={() => onFocus()} onBlur={() => onBlur()}>
        <Search className={cn('absolute top-[50%] left-6 size-5 translate-[-50%] text-gray-400')} />
        <Input className='h-12 pl-10 focus-visible:border-transparent' placeholder='Поиск по объявлениям' />
        <Button
          variant='default'
          className='text-md absolute top-[50%] right-[2px] h-11 translate-y-[-50%] px-5 font-normal active:translate-y-[-50%]!'
        >
          Найти
        </Button>
      </div>
      {isFocus && <div className='fixed inset-0 z-50 h-full w-full bg-black/20'></div>}
    </div>
  )
}
