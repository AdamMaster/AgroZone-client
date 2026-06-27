'use client'

import { usePathname } from 'next/navigation'
import { useMemo } from 'react'

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

  const isVisible = useMemo(() => {
    if (!pathname) return false
    return pathname === '/' || pathname.startsWith('/catalog')
  }, [pathname])

  if (!isVisible) return null

  if (!categories?.length) return null

  return (
    <Container>
      <div className={cn('flex flex-wrap gap-1', className)}>
        {categories.map(category => (
          <CategoryItem key={category.id} category={category} />
        ))}
      </div>
    </Container>
  )
}
