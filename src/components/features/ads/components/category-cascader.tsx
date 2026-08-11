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
import { ICategory, ICategoryFeature } from '../types/ad.types'

interface CategoryCascaderProps {
  categories: ICategory[]
  form: UseFormReturn<TypeCreateAdSchema>
  onCategorySelect: (features: ICategoryFeature[], priceUnits: string[]) => void
}

export const CategoryCascader = ({ categories, form, onCategorySelect }: CategoryCascaderProps) => {
  const [selectedPath, setSelectedPath] = useState<string[]>([])
  const [open, setOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const flatCategories = useMemo(() => flattenCategories(categories), [categories])
  const listRef = useRef<HTMLDivElement>(null)
  const setCategoryPath = useAdStore(state => state.setCategoryPath)
  const categoryPath = useAdStore(state => state.categoryPath)
  const categoryId = form.watch('categoryId')
  // Категория-предохранитель для тех, кто не нашёл товар в поиске (см.
  // обсуждение с пользователем — "медный купорос" никак не совпадёт по
  // названию ни с одной категорией). Матчим по названию, а не по id —
  // в этом проекте так же завязаны на русские названия и другие спец-случаи
  // (см. FEDERAL_CITY_REGION_NAMES на бэкенде), стабильного отдельного кода
  // "это категория-корзина" в схеме нет.
  const otherCategory = useMemo(() => categories.find(c => c.name === 'Прочее'), [categories])
  // Кнопки категорий в колонках — чтобы можно было доскроллить до выбранной,
  // если она за пределами видимой области ScrollArea (см. ниже). Карта, а
  // не один ref: выбранных кнопок сразу несколько — по одной в каждой
  // колонке пути.
  const categoryButtonRefs = useRef<Map<string, HTMLButtonElement>>(new Map())

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
      onCategorySelect(
        fullCategory.categoryFeatures || [],
        fullCategory.priceUnits?.length ? fullCategory.priceUnits : ['ITEM']
      )
      const pathNames = path.map(id => findCategoryById(categories, id)?.name).filter(Boolean) as string[]
      setCategoryPath(pathNames)
    } else {
      form.setValue('categoryId', '', { shouldValidate: true })
      form.setValue('categoryFeatures', {})
      onCategorySelect([], ['ITEM'])
    }
    setOpen(false)
  }

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = 0
    }
  }, [searchTerm])

  useEffect(() => {
    selectedPath.forEach(id => {
      categoryButtonRefs.current.get(id)?.scrollIntoView({ block: 'nearest' })
    })
  }, [selectedPath])

  return (
    <div>
      <Command className={cn('overflow-initial relative mb-3 rounded-lg border', open ? 'focus-input' : 'border')}>
        <CommandInput
          className='text-md p-0 placeholder:text-gray-500'
          placeholder='Начните вводить название товара, например "Яблоки"'
          onFocus={() => {
            if (searchTerm.trim().length > 0) setOpen(true)
          }}
          onBlur={() => setTimeout(() => setOpen(false), 200)}
          onValueChange={val => {
            setSearchTerm(val)
            setOpen(val.trim().length > 0)
          }}
        />
        {/* Блок держим смонтированным ВСЕГДА (не {open && (...)}) — cmdk
            регистрирует каждый Command.Item и считает его текстовое
            значение для фильтрации в момент монтирования; если монтировать
            список только когда searchTerm уже непустой (то есть регистрация
            пунктов происходит ПОСЛЕ того как поиск стал непустым), первая
            фильтрация у cmdk может не сработать — список остаётся пустым,
            хотя совпадения есть (баг, замеченный пользователем). Поэтому
            пункты регистрируются сразу при монтировании компонента, ещё при
            пустом поиске, а видимость блока переключаем просто классом
            hidden, не трогая DOM-дерево cmdk. */}
        <div
          className={cn(
            'absolute top-[calc(100%+10px)] left-0 z-10 w-full overflow-hidden rounded-lg border bg-white shadow-[0_4px_16px_rgba(0,0,0,0.08)]',
            !open && 'hidden'
          )}
        >
          <CommandList className='rounded-0 py-2' ref={listRef}>
            {/* Раньше тут был просто текст "Категории не найдены" — тупик
                без единой подсказки, что делать дальше (см. обсуждение:
                "медный купорос" не совпадёт с названием ни одной категории,
                хотя он реально продаётся в "Агрохимии"). Даём два выхода:
                попробовать другое слово и/или сразу заглянуть в "Прочее" —
                категорию-корзину для того, что не подошло больше никуда. */}
            <CommandEmpty className='flex flex-col items-center gap-2 px-3.5 py-6 text-center text-sm'>
              <span className='text-gray-500'>
                Ничего не нашли. Попробуйте более простое или общее название товара.
              </span>
              {otherCategory && (
                <button
                  type='button'
                  className='text-primary underline underline-offset-2 hover:no-underline'
                  onClick={() => handleCategorySelect(otherCategory.id)}
                >
                  Или посмотрите категорию «Прочее»
                </button>
              )}
            </CommandEmpty>
            <CommandGroup>
              {flatCategories.map(cat => (
                <CommandItem
                  className='flex w-full cursor-pointer items-center justify-between gap-2 px-3.5 py-1 hover:bg-gray-50'
                  key={cat.id}
                  onSelect={() => handleCategorySelect(cat.id)}
                >
                  <div className='flex flex-wrap items-center gap-2.5'>
                    {cat.path.map((name, index) => (
                      <div key={index} className='flex items-center gap-2.5'>
                        {name}
                        {index < cat.path.length - 1 && (
                          <ChevronRight className='text-muted-foreground size-4 shrink-0' />
                        )}
                      </div>
                    ))}
                  </div>
                  {/* У категории есть подкатегории — клик по ней не
                      выбирает её как итоговую, а раскрывает колонки ниже
                      для уточнения (см. handleCategorySelect). Явно
                      подписываем это, иначе выглядит так, будто клик
                      ничего не сделал. */}
                  {cat.hasChildren && (
                    <span className='flex shrink-0 items-center gap-1 text-xs text-gray-400'>
                      Уточнить
                      <ChevronRight className='size-3.5' />
                    </span>
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </div>
      </Command>
      {/* Раньше единственным подтверждением выбора была серая подсветка
          кнопки в одной из колонок — не видно, если список длинный и
          выбранный пункт прокручен за пределы 400px-области, а на первом
          шаге хлебные крошки (CategoryBreadcrumbs) ещё не показываются —
          они появляются только на шаге 2 (см. AdForm). Показываем текстом
          сразу здесь; categoryPath синхронно проставляется в сторе именно
          в момент выбора ЛИСТОВОЙ категории (см. handleCategorySelect), так
          что и то и другое условие — categoryId и categoryPath.length —
          гарантированно совпадают. */}
      {categoryId && categoryPath.length > 0 && (
        <p className='mb-3 text-sm text-gray-500'>
          Выбрано: <span className='font-medium text-gray-900'>{categoryPath.join(' → ')}</span>
        </p>
      )}
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
                    ref={el => {
                      if (el) categoryButtonRefs.current.set(cat.id, el)
                      else categoryButtonRefs.current.delete(cat.id)
                    }}
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
