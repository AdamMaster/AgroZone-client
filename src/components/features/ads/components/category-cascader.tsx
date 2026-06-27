'use client'

import { useAdStore } from '@/store'
import { CommandItem } from 'cmdk'
import { ChevronRight } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { UseFormReturn } from 'react-hook-form'

import { Command, CommandEmpty, CommandGroup, CommandInput, CommandList, ScrollArea } from '@/components/ui'

import { findCategoryById, flattenCategories, getPathToCategory } from '@/shared/utils'

import { cn } from '@/lib/utils'

import { TypeCreateAdSchema } from '../schemes'
import { IAvailableFeature, ICategory } from '../types/ad.types'

interface CategoryCascaderProps {
  categories: ICategory[]
  form: UseFormReturn<TypeCreateAdSchema>
  onCategorySelect: (features: IAvailableFeature[]) => void
}

export const CategoryCascader = ({ categories, form, onCategorySelect }: CategoryCascaderProps) => {
  const [selectedPath, setSelectedPath] = useState<string[]>([])
  const [open, setOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const flatCategories = useMemo(() => flattenCategories(categories), [categories])
  const listRef = useRef<HTMLDivElement>(null)
  const setCategoryPath = useAdStore(state => state.setCategoryPath)

  const columns = useMemo(() => {
    const result: ICategory[][] = [categories]
    for (const selectedId of selectedPath) {
      const parentColumn = result[result.length - 1]
      const selectedCategory = parentColumn?.find(c => c.id === selectedId)
      if (selectedCategory?.children?.length) {
        result.push(selectedCategory.children)
      } else break
    }
    return result
  }, [selectedPath, categories])

  const handleCategorySelect = (catId: string) => {
    const path = getPathToCategory(categories, catId)
    setSelectedPath(path)

    const fullCategory = findCategoryById(categories, catId)

    if (fullCategory && (!fullCategory.children || fullCategory.children.length === 0)) {
      form.setValue('categoryId', catId, { shouldValidate: true })
      onCategorySelect(fullCategory.availableFeatures || [])
      const pathNames = path.map(id => findCategoryById(categories, id)?.name).filter(Boolean) as string[]
      setCategoryPath(pathNames)
    } else {
      form.setValue('categoryId', '', { shouldValidate: true })
      form.setValue('features', {})
      onCategorySelect([])
    }
    setOpen(false)
  }

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = 0
    }
  }, [searchTerm])

  return (
    <div>
      <Command className={cn('overflow-initial relative mb-3 rounded-lg border', open ? 'focus-input' : 'border')}>
        <CommandInput
          className='p-0 placeholder:text-gray-500'
          placeholder='Поиск категории...'
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 200)}
          onValueChange={val => {
            setSearchTerm(val)
            setOpen(true)
          }}
        />
        {open && (
          <div className='absolute top-[calc(100%+10px)] left-0 z-10 w-full overflow-hidden rounded-lg border bg-white shadow-[0_4px_16px_rgba(0,0,0,0.08)]'>
            <CommandList className='rounded-0 py-2' ref={listRef}>
              <CommandEmpty>Категории не найдены.</CommandEmpty>
              <CommandGroup>
                {flatCategories.map(cat => (
                  <CommandItem
                    className='flex cursor-pointer gap-2 px-3.5 py-1 hover:bg-gray-50'
                    key={cat.id}
                    onSelect={() => handleCategorySelect(cat.id)}
                  >
                    {cat.path.map((name, index) => (
                      <div key={index} className='flex items-center gap-2.5'>
                        {name}
                        {index < cat.path.length - 1 && (
                          <ChevronRight className='text-muted-foreground size-4 shrink-0' />
                        )}
                      </div>
                    ))}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </div>
        )}
      </Command>
      <div className='space-y-2'>
        <div className='grid grid-cols-3 gap-1'>
          {columns.map((columnCategories, columnIndex) => (
            <ScrollArea key={columnIndex} className='h-[400px] pr-2.5'>
              {columnCategories.map(cat => {
                const isSelected = selectedPath[columnIndex] === cat.id
                const hasChildren = cat.children && cat.children.length > 0

                return (
                  <button
                    key={cat.id}
                    type='button'
                    onClick={() => {
                      const newPath = [...selectedPath.slice(0, columnIndex), cat.id]
                      setSelectedPath(newPath)
                      handleCategorySelect(cat.id)
                    }}
                    className={cn(
                      'relative flex w-full items-center justify-between rounded-lg px-4 py-3 text-left transition-colors hover:bg-gray-50',
                      isSelected && 'bg-gray-100'
                    )}
                  >
                    <span>{cat.name}</span>
                    {hasChildren && <ChevronRight className='absolute top-[50%] right-2 size-5 translate-y-[-50%]' />}
                  </button>
                )
              })}
            </ScrollArea>
          ))}
        </div>

        {/* <Controller
          name='categoryId'
          control={form.control}
          render={({ fieldState }) => <>{fieldState.invalid && <FieldError errors={[fieldState.error]} />}</>}
        /> */}
      </div>
    </div>
  )
}
