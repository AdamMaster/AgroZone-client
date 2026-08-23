'use client'

import { useCategoriesModal } from '@/store'
import { ChevronRight } from 'lucide-react'
import { useParams, usePathname } from 'next/navigation'
import { useLayoutEffect, useMemo, useRef, useState } from 'react'

import { Container } from '@/components/layout'

import { cn } from '@/lib/utils'

import { ICategory } from '../types/categories.types'
import { buildCategoryMap } from '../utils/category-utils'
import { CategoryItem } from './category-item'

interface CategoryGridProps {
  categories: ICategory[]
  className?: string
}

export const CategoryGrid = ({ categories, className }: CategoryGridProps) => {
  const pathname = usePathname()
  const params = useParams<{ slug?: string[] }>()
  const measureRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const { isOpen, onOpen } = useCategoriesModal()
  const [visibleCount, setVisibleCount] = useState<number | null>(null)
  const isCatalog = pathname.startsWith('/catalog')
  const categoryMap = useMemo(() => buildCategoryMap(categories), [categories])

  const getCategoryHref = (category: ICategory & { isParent?: boolean }) => {
    if (!category.isParent) {
      return `/catalog/${category.fullPath}`
    }

    const currentPath = params.slug?.join('/')

    const currentCategory = currentPath ? categoryMap.get(currentPath) : null

    return currentCategory?.parent ? `/catalog/${currentCategory.parent.fullPath}` : '/catalog'
  }

  const itemsToRender = useMemo(() => {
    if (!categories?.length) return []

    const fullPath = params.slug?.join('/')

    if (isCatalog && fullPath) {
      const result = categoryMap.get(fullPath)

      if (result) {
        const { category, parent } = result

        if (category.children?.length) {
          return [
            {
              ...category,
              isParent: true
            },
            ...category.children
          ]
        }

        if (parent?.children?.length) {
          return [
            {
              ...parent,
              isParent: true
            },
            ...parent.children
          ]
        }
      }
    }

    return categories.filter(item => !item.parentId)
  }, [categories, params.slug, categoryMap, isCatalog])

  const shouldRender = Boolean(pathname) && (pathname === '/' || isCatalog) && itemsToRender.length > 0

  useLayoutEffect(() => {
    const measureContainer = measureRef.current
    const container = containerRef.current

    if (!shouldRender || !measureContainer || !container) {
      setVisibleCount(null)
      return
    }

    const calculate = () => {
      const containerWidth = container.getBoundingClientRect().width

      const elements = Array.from(measureContainer.children) as HTMLElement[]

      const gap = 8
      const buttonWidth = 150

      let row = 1
      let width = 0
      let count = 0

      for (const element of elements) {
        const itemWidth = element.getBoundingClientRect().width

        const nextWidth = width === 0 ? itemWidth : width + gap + itemWidth

        if (nextWidth > containerWidth) {
          row++
          width = itemWidth
        } else {
          width = nextWidth
        }

        if (row > 2) {
          break
        }

        count++
      }

      if (count >= itemsToRender.length) {
        setVisibleCount(itemsToRender.length)
        return
      }

      let finalCount = count
      let testWidth = 0
      let testRow = 1

      for (let i = 0; i < finalCount; i++) {
        const itemWidth = elements[i].getBoundingClientRect().width

        if (testWidth + itemWidth + buttonWidth + gap > containerWidth) {
          testRow++

          if (testRow > 2) {
            finalCount = i
            break
          }

          testWidth = itemWidth
        } else {
          testWidth += itemWidth + gap
        }
      }

      setVisibleCount(finalCount)
    }

    calculate()

    const observer = new ResizeObserver(calculate)

    observer.observe(container)

    return () => observer.disconnect()
  }, [itemsToRender, shouldRender])

  if (!shouldRender) {
    return null
  }

  const isCalculated = visibleCount !== null

  const visibleItems = visibleCount === null ? itemsToRender : itemsToRender.slice(0, visibleCount)

  const hiddenCount = itemsToRender.length - visibleItems.length

  return (
    <div className={className}>
      <Container>
        <div ref={measureRef} className='pointer-events-none invisible absolute flex flex-wrap gap-2'>
          {itemsToRender.map(item => (
            <CategoryItem
              key={item.id}
              category={{
                ...item,
                isSelected: item.fullPath === params.slug?.join('/')
              }}
              href={getCategoryHref(item)}
            />
          ))}
        </div>

        {/* Мобилка, верхний уровень (категории с картинками, !isCatalog) —
            вместо JS-подсчёта того, сколько влезает в 2 ряда, и обрезания
            кнопкой «Все категории» — рендерим сразу ВСЕ категории в 2
            фиксированных ряда через CSS Grid (grid-flow-col + grid-rows-2,
            каждая следующая категория уходит в новую колонку) и даём
            проскроллить лишнее пальцем по горизонтали, без видимого
            скроллбара (см. обсуждение с пользователем). Подкатегории-чипсы
            (isCatalog — когда уже находимся внутри категории) это не
            затрагивает, для них поведение ниже осталось прежним на всех
            экранах. */}
        {!isCatalog && (
          <div className='scrollbar-none overflow-auto'>
            <div className='flex w-270 flex-wrap gap-2 md:hidden'>
              {itemsToRender.map(item => (
                <CategoryItem
                  key={item.id}
                  category={{
                    ...item,
                    isSelected: item.fullPath === params.slug?.join('/')
                  }}
                  href={getCategoryHref(item)}
                />
              ))}
            </div>
          </div>
        )}

        <div
          ref={containerRef}
          className={cn(
            'w-full flex-wrap gap-2 transition-opacity duration-150',
            !isCalculated ? 'opacity-0' : 'opacity-100',
            // Десктоп — всегда этот вариант (JS-подсчёт + кнопка «Все
            // категории»), как и было. На мобилке — только для
            // подкатегорий-чипсов (isCatalog); верхний уровень на мобилке
            // рендерится блоком выше, этот вариант там скрыт.
            !isCatalog ? 'hidden md:flex' : 'flex'
          )}
        >
          {visibleItems.map(item => {
            return (
              <CategoryItem
                key={item.id}
                category={{
                  ...item,
                  isSelected: item.fullPath === params.slug?.join('/')
                }}
                href={getCategoryHref(item)}
              />
            )
          })}

          {hiddenCount > 0 && (
            <button
              onClick={() => onOpen()}
              className='hover:text-primary flex items-center gap-1 px-2.5 py-2 text-sm transition-colors'
            >
              Все категории
              <ChevronRight size={15} />
            </button>
          )}
        </div>
      </Container>
    </div>
  )
}
