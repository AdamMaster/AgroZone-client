'use client'

import { ChevronLeft } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'

import { cn } from '@/lib/utils'

import { ICategory } from '../types/categories.types'

interface CategoryItemProps {
  category: ICategory & {
    isParent?: boolean
  }
}

export const CategoryItem = ({ category }: CategoryItemProps) => {
  const router = useRouter()
  const params = useParams()

  const currentCategorySlug = Array.isArray(params.slug) ? params.slug.join('/') : params.slug || null

  const isSelected = currentCategorySlug === category.slug

  const onClick = () => {
    if (category.isParent) {
      router.push('/catalog', { scroll: false })
      return
    }

    if (isSelected) {
      router.push('/catalog', { scroll: false })
    } else {
      router.push(`/catalog/${category.slug}`, { scroll: false })
    }
  }

  return (
    <button
      className={cn(
        'flex items-center gap-1 rounded-lg px-2.5 py-2 text-sm transition-colors',
        isSelected ? 'bg-secondary border-secondary! text-white' : 'bg-gray-100 hover:bg-gray-200',
        category.isParent && 'border-primary hover:bg-primary-foreground bg-primary text-white'
      )}
      onClick={onClick}
    >
      {category.isParent && <ChevronLeft size={16} />}
      {category.name}
    </button>
  )
}
