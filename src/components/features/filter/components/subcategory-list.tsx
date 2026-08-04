'use client'

import { CommandItem } from 'cmdk'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { Command, CommandEmpty, CommandGroup, CommandInput, CommandList, Label } from '@/components/ui'

import { cn } from '@/lib/utils'

import { ICategory } from '../../categories/types'

interface SubcategoryListProps {
  category: ICategory
}

// Список подкатегорий — обычная навигация в одну из них (переход по
// ссылке), не мультивыбор — тот же смысл, что и раньше, просто другой
// компонент. Через Command (тот же cmdk, что уже используется в
// CategoryCascader на форме подачи объявления), а не плоский список ссылок
// с "Показать ещё": у категорий сайта медианное число подкатегорий — 12, а
// у некоторых ("Фрукты, ягоды" и т.п.) — больше 50, так что список с
// разворачиванием превращался бы в стену ссылок в узком сайдбаре.
export const SubcategoryList = ({ category }: SubcategoryListProps) => {
  const router = useRouter()
  const [open, setOpen] = useState(false)

  const children = category.children ?? []

  if (!children.length) return null

  const handleSelect = (fullPath: string) => {
    setOpen(false)
    router.push(`/catalog/${fullPath}`)
  }

  return (
    <div className='flex flex-col gap-2'>
      <Label>Категория</Label>
      <Command className={cn('overflow-initial relative rounded-lg border', open ? 'focus-input' : 'border')}>
        <CommandInput
          className='p-0 placeholder:text-gray-500'
          placeholder='Найти категорию'
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 200)}
        />
        {open && (
          <div className='absolute top-[calc(100%+10px)] left-0 z-10 w-full overflow-hidden rounded-lg border bg-white shadow-[0_4px_16px_rgba(0,0,0,0.08)]'>
            <CommandList className='rounded-0 py-2'>
              <CommandEmpty>Категории не найдены.</CommandEmpty>
              <CommandGroup>
                {children.map(child => (
                  <CommandItem
                    className='flex cursor-pointer gap-2 px-3.5 py-1.5 text-sm hover:bg-gray-50'
                    key={child.id}
                    value={child.name}
                    onSelect={() => handleSelect(child.fullPath)}
                  >
                    {child.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </div>
        )}
      </Command>
    </div>
  )
}
