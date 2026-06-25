'use client'

import { useRouter, useSearchParams } from 'next/navigation'

import { cn } from '@/lib/utils'

import { ICategory } from '../types/categories.types'

interface CategoryItemProps {
  category: ICategory
}

export const CategoryItem = ({ category }: CategoryItemProps) => {
  const router = useRouter()
  const searchParams = useSearchParams()

  const currentCategorySlug = searchParams.get('category')
  const isSelected = currentCategorySlug === category.slug

  const onClick = () => {
    if (isSelected) {
      router.push('/catalog', { scroll: false }) // Сброс фильтра
    } else {
      router.push(`/catalog/${category.slug}`, { scroll: false }) // Переход на ЧПУ
    }
  }

  return (
    <button
      className={cn(
        'rounded-lg px-2.5 py-2 text-sm transition-colors',
        isSelected ? 'bg-secondary border-secondary! text-white' : 'border bg-gray-50 hover:bg-gray-100'
      )}
      onClick={onClick}
    >
      {category.name}
    </button>
  )
}
