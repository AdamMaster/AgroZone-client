'use client'

import { useParams, useRouter } from 'next/navigation'

import { cn } from '@/lib/utils'

import { ICategory } from '../types/categories.types'

interface CategoryItemProps {
  category: ICategory
}

export const CategoryItem = ({ category }: CategoryItemProps) => {
  const router = useRouter()
  const params = useParams()

  const currentCategorySlug = Array.isArray(params.slug) ? params.slug.join('/') : params.slug || null

  const isSelected = currentCategorySlug === category.slug

  const onClick = () => {
    if (isSelected) {
      router.push('/catalog', { scroll: false })
    } else {
      router.push(`/catalog/${category.slug}`, { scroll: false })
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
