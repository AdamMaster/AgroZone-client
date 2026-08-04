'use client'

import { CommandItem } from 'cmdk'
import { useEffect, useState } from 'react'

import { Command, CommandEmpty, CommandGroup, CommandInput, CommandList, Label } from '@/components/ui'

import { cn } from '@/lib/utils'

import { IRegionOption } from '../../ads/types/ad.types'
import { useRegions } from '../hooks/use-regions'

interface RegionFilterProps {
  value?: string
  onChange: (regionIsoCode: string | undefined) => void
}

// Фильтр по региону — на любом уровне каталога (как цена и подкатегории),
// не зависит от выбранной категории. Список регионов — НЕ статический
// хардкод географии РФ (см. обсуждение с пользователем: это было бы и
// политически спорно на некоторых границах, и быстро расходилось бы с
// реальностью), а список регионов, в которых прямо сейчас есть хотя бы
// одно опубликованное объявление (AdsService.getAvailableRegions) — так
// фильтр никогда не предложит регион, где заведомо ничего не найдётся.
// Тот же Command-виджет, что и в SubcategoryList, только выбор не
// переходит на другую страницу, а обновляет ?regionIsoCode= в фильтре.
export const RegionFilter = ({ value, onChange }: RegionFilterProps) => {
  const { regions, isLoadingRegions } = useRegions()
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')

  // Синхронизация отображаемого текста с активным фильтром — нужна, чтобы
  // при загрузке страницы с уже применённым ?regionIsoCode= (например, по
  // прямой ссылке или после навигации назад) поле показывало название
  // региона, а не выглядело пустым.
  useEffect(() => {
    if (!value) {
      setSearch('')
      return
    }

    const selected = regions.find(r => r.regionIsoCode === value)

    if (selected) setSearch(selected.region)
  }, [value, regions])

  // Пока не опубликовано ни одного объявления с определённым регионом,
  // фильтровать банально не по чему — не показываем пустой блок.
  if (!isLoadingRegions && !regions.length) return null

  const handleSelect = (option: IRegionOption) => {
    setSearch(option.region)
    setOpen(false)
    onChange(option.regionIsoCode)
  }

  const handleClear = () => {
    setSearch('')
    onChange(undefined)
  }

  return (
    <div className='flex flex-col gap-2'>
      <div className='flex items-center justify-between'>
        <Label>Регион</Label>
        {value && (
          <button type='button' onClick={handleClear} className='text-secondary text-xs hover:underline'>
            Сбросить
          </button>
        )}
      </div>
      <Command className={cn('overflow-initial relative rounded-lg border', open ? 'focus-input' : 'border')}>
        <CommandInput
          className='p-0 placeholder:text-gray-500'
          placeholder='Найти регион'
          value={search}
          onValueChange={setSearch}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 200)}
        />
        {open && (
          <div className='absolute top-[calc(100%+10px)] left-0 z-10 w-full overflow-hidden rounded-lg border bg-white shadow-[0_4px_16px_rgba(0,0,0,0.08)]'>
            <CommandList className='rounded-0 py-2'>
              <CommandEmpty>Регионы не найдены.</CommandEmpty>
              <CommandGroup>
                {regions.map(option => (
                  <CommandItem
                    className='flex cursor-pointer gap-2 px-3.5 py-1.5 text-sm hover:bg-gray-50'
                    key={option.regionIsoCode}
                    value={option.region}
                    onSelect={() => handleSelect(option)}
                  >
                    {option.region}
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
