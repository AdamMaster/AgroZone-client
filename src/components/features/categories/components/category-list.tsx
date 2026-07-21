'use client'

import { useCategoriesModal } from '@/store'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useMemo, useState } from 'react'

import { Heading } from '@/components/ui'

import { cn } from '@/lib/utils'

import { useCategories } from '../hooks/use-categories'
import { ICategory } from '../types'
import { buildCategoryMap } from '../utils/category-utils'

export const CategoryList = () => {
  const { categories } = useCategories()
  const { onClose } = useCategoriesModal()

  const [expandedCategories, setExpandedCategories] = useState<(string | number)[]>([])

  const params = useParams<{
    slug?: string[]
  }>()

  const categoryMap = useMemo(() => {
    if (!categories?.length) return new Map()

    return buildCategoryMap(categories)
  }, [categories])

  const currentCategoryData = useMemo(() => {
    const fullPath = params.slug?.join('/')

    if (!fullPath) return null

    return categoryMap.get(fullPath) ?? null
  }, [categoryMap, params.slug])

  const targetCategoryData = useMemo(() => {
    if (!currentCategoryData) return null

    const { category, parent } = currentCategoryData

    if (category.children?.length) {
      return category
    }

    // Если нет детей, фоллбэчимся на родителя
    return parent ?? category
  }, [currentCategoryData])

  const currentCategory = currentCategoryData?.category

  const items = useMemo<ICategory[]>(() => {
    if (targetCategoryData) {
      return targetCategoryData.children ?? []
    }

    return categories.filter(category => !category.parentId)
  }, [categories, targetCategoryData])

  const toggleExpanded = (id: string | number) => {
    setExpandedCategories(prev => (prev.includes(id) ? prev.filter(categoryId => categoryId !== id) : [...prev, id]))
  }

  const handleClose = () => {
    onClose()
  }

  return (
    <div className='flex h-full flex-col'>
      <Heading level={2} className='mb-6 text-xl font-bold'>
        {targetCategoryData?.name ?? 'Все категории'}
      </Heading>

      <div className='custom-scrollbar flex-1 columns-3 overflow-y-auto pr-3'>
        {items.map(category => {
          const children = category.children ?? []

          const isExpanded = expandedCategories.includes(category.id)

          const visibleChildren = isExpanded ? children : children.slice(0, 5)

          return (
            <div key={category.id} className='flex break-inside-avoid-column flex-col pb-4'>
              <Link
                href={`/catalog/${category.fullPath}`}
                onClick={handleClose}
                className={cn('hover:text-primary text-[15px]', !targetCategoryData && 'pb-0.5 font-bold')}
              >
                {category.name}
                &nbsp;&nbsp;›
              </Link>

              <div>
                {visibleChildren.map(child => (
                  <Link
                    key={child.id}
                    href={`/catalog/${child.fullPath}`}
                    onClick={handleClose}
                    className='hover:text-primary block py-1 text-[13px]'
                  >
                    {child.name}
                  </Link>
                ))}

                {children.length > 5 && (
                  <button
                    type='button'
                    onClick={() => toggleExpanded(category.id)}
                    className='hover:text-primary block text-[13px] text-gray-500 transition-colors'
                  >
                    {isExpanded ? 'Скрыть' : `Ещё ${children.length - 5}`}
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
