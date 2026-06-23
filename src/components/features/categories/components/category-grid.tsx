import { cn } from '@/lib/utils'

import { CategoryItem } from './category-item'
import { ICategory } from './types/categories.types'

interface CategoryGridProps {
  categories: ICategory[]
  className?: string
}

export const CategoryGrid = ({ categories, className }: CategoryGridProps) => {
  return (
    <div className={cn('flex flex-wrap gap-1', className)}>
      {categories.map(category => (
        <CategoryItem key={category.id} category={category} />
      ))}
    </div>
  )
}
