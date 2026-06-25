'use client'

import { usePathname } from 'next/navigation'

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

  const isVisible = pathname === '/' || pathname.startsWith('/catalog')

  if (!isVisible) return null

  console.log(categories)

  return (
    <Container>
      <div className={cn('flex flex-wrap gap-1', className)}>
        {categories.map(category => {
          console.log('Кнопка рендерится:', {
            id_из_объекта: category.id,
            весь_объект: category
          })
          return <CategoryItem key={category.id} category={category} />
        })}
      </div>
    </Container>
  )
}
