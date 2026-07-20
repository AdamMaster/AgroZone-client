'use client'

import { useCategoriesModal } from '@/store'
import { ChevronRight } from 'lucide-react'
import { useParams, usePathname } from 'next/navigation'
import { useLayoutEffect, useMemo, useRef, useState } from 'react'

import { Container } from '@/components/layout'

import { cn } from '@/lib/utils'

import { ICategory } from '../types/categories.types'
import { CategoryItem } from './category-item'

interface CategoryGridProps {
  categories: ICategory[]
  className?: string
}

export const CategoryGrid = ({ categories, className }: CategoryGridProps) => {
  const pathname = usePathname()
  const params = useParams()

  const measureRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const { isOpen, onOpen } = useCategoriesModal()

  const [visibleCount, setVisibleCount] = useState<number | null>(null)

  const itemsToRender = useMemo(() => {
    if (!categories?.length) return []

    const slugArray = params?.slug as string[] | undefined

    if (pathname.startsWith('/catalog') && slugArray?.length) {
      const currentSlug = slugArray[slugArray.length - 1]

      const category = categories.find(item => item.slug === currentSlug)

      if (category?.children?.length) {
        return [
          {
            ...category,
            isParent: true
          },
          ...category.children
        ]
      }

      const parent = categories.find(item => item.children?.some(child => child.slug === currentSlug))

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

    return categories.filter(item => !item.parentId)
  }, [categories, pathname, params])

  useLayoutEffect(() => {
    const measureContainer = measureRef.current
    const container = containerRef.current

    if (!measureContainer || !container || !itemsToRender.length) {
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
  }, [itemsToRender])

  if (!pathname || !(pathname === '/' || pathname.startsWith('/catalog')) || !itemsToRender.length) {
    return null
  }

  const isCalculated = visibleCount !== null

  const visibleItems = isCalculated ? itemsToRender.slice(0, visibleCount!) : itemsToRender

  const hiddenCount = itemsToRender.length - visibleItems.length

  return (
    <Container className={className}>
      <div ref={measureRef} className='pointer-events-none invisible absolute flex flex-wrap gap-2'>
        {itemsToRender.map(item => (
          <div key={item.id}>
            <CategoryItem category={item} />
          </div>
        ))}
      </div>

      <div
        ref={containerRef}
        className={cn(
          'flex w-full flex-wrap gap-2 transition-opacity duration-150',
          !isCalculated ? 'opacity-0' : 'opacity-100'
        )}
      >
        {visibleItems.map(item => (
          <div key={item.id}>
            <CategoryItem category={item} />
          </div>
        ))}

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
  )
}
