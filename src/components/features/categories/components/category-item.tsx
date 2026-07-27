'use client'

import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'

import { cn } from '@/lib/utils'

import { ICategory } from '../types/categories.types'

interface CategoryItemProps {
  category: ICategory & {
    isParent?: boolean
    isSelected?: boolean
  }
  href: string
  onClick?: () => void
}

export const CategoryItem = ({ category, href, onClick }: CategoryItemProps) => {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        'flex items-center gap-1 rounded-lg bg-gray-100 px-2.5 py-2 text-sm transition-colors hover:bg-gray-200',
        category.isSelected && 'bg-secondary hover:bg-secondary-foreground text-white',
        category.isParent && 'bg-primary hover:bg-primary-foreground text-white'
      )}
    >
      {category.isParent && <ChevronLeft size={16} />}
      {category.name}
    </Link>
  )
}
