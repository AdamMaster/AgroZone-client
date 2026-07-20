'use client'

import { useCategoriesModal } from '@/store'
import { ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { useParams, usePathname } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'

import { Heading } from '@/components/ui'

import { cn } from '@/lib/utils'

import { useCategories } from '../hooks/use-categories'
import { ICategory } from '../types'

export const CategoryList = () => {
  const { categories } = useCategories()
  const { onClose } = useCategoriesModal()

  const pathname = usePathname()
  const params = useParams()

  const parentCategory = useMemo(() => {
    if (!categories?.length) return null

    const slugArray = params?.slug as string[] | undefined

    if (!slugArray?.length) return null

    const currentSlug = slugArray[slugArray.length - 1]

    const currentCategory = categories.find(item => item.slug === currentSlug)

    if (currentCategory && !currentCategory.parentId) {
      return currentCategory
    }

    // если текущая категория второго/третьего уровня
    return categories.find(item => item.children?.some(child => child.slug === currentSlug)) ?? null
  }, [categories, params])

  const items = useMemo(() => {
    if (!categories?.length) return []

    const slugArray = params?.slug as string[] | undefined

    if (pathname.startsWith('/catalog') && slugArray?.length) {
      const currentSlug = slugArray[slugArray.length - 1]

      const category = categories.find(item => item.slug === currentSlug)

      if (category?.children?.length) {
        return category.children
      }

      const parent = categories.find(item => item.children?.some(child => child.slug === currentSlug))

      if (parent?.children?.length) {
        return parent.children
      }
    }

    return categories.filter(item => !item.parentId)
  }, [categories, pathname, params, parent])

  const [activeCategoryId, setActiveCategoryId] = useState<string | number | null>(null)

  const activeCategory = useMemo(() => {
    return items.find(item => item.id === activeCategoryId) ?? items[0]
  }, [items, activeCategoryId])

  const onClickArrow = (item: ICategory) => {}

  return (
    <div className='flex h-full max-h-[75vh] flex-col'>
      <Heading level={2} className='mb-4 text-xl font-bold'>
        {parentCategory?.name}
      </Heading>

      <div className='mx-[-16px] grid grid-cols-[380px_1fr] gap-6 overflow-hidden'>
        <div className='custom-scrollbar max-h-[60vh] space-y-1 overflow-y-auto pr-2'>
          {items.map(item => {
            const isActive = item.id === activeCategory?.id
            const hasChildren = item.children && item.children.length > 0

            return (
              <div key={item.id} onMouseEnter={() => setActiveCategoryId(item.id)} className={cn('relative')}>
                <Link
                  href={`/catalog/${item.slug}`}
                  className={cn(
                    'relative flex w-full gap-3 rounded-lg px-4 py-3 pr-8 text-left text-[15px] font-medium transition-colors',
                    isActive ? 'bg-gray-100' : ''
                  )}
                  onClick={() => onClose()}
                >
                  {item.name}
                </Link>
                {hasChildren && (
                  <button className='absolute top-3.5 right-2' onClick={() => setActiveCategoryId(item.id)}>
                    <ChevronRight className='size-4' />
                  </button>
                )}
              </div>
            )
          })}
        </div>

        <div className='custom-scrollbar max-h-[60vh] overflow-y-auto border-gray-100'>
          {activeCategory && (
            <div className='space-y-4'>
              <Heading level={5} className='font-bold'>
                {activeCategory.name}
              </Heading>

              {activeCategory.children && activeCategory.children.length > 0 ? (
                <div className='columns-2'>
                  {activeCategory.children.map(child => (
                    <Link
                      key={child.id}
                      href={`/catalog/${child.slug}`}
                      className='hover:text-primary block border-b border-transparent py-1.5 text-[15px] text-gray-600 transition-colors'
                      onClick={() => onClose()}
                    >
                      {child.name}
                    </Link>
                  ))}
                </div>
              ) : (
                <div className='text-[15px] text-gray-500'>В этой категории нет подкатегорий</div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
