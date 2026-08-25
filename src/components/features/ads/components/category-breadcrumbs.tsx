import { ChevronRight } from 'lucide-react'
import Link from 'next/link'

import { cn } from '@/lib/utils'

// Универсальные хлебные крошки — принимают готовый массив пунктов, ничего
// сами не знают про источник данных. Раньше был жёстко завязан на
// useAdStore (стейт формы создания объявления), из-за чего его нельзя было
// переиспользовать там, где категория приходит не из стора (например, на
// публичной странице объявления).
//
// `href` у пункта опциональный: там, где кликать некуда или не нужно
// (например, в форме создания объявления — крошки там просто показывают
// текущий выбор, а не ведут по каталогу), можно передать пункты без href,
// и они отрендерятся обычным текстом.
export interface CategoryBreadcrumbItem {
  name: string
  href?: string
}

interface CategoryBreadcrumbsProps {
  items: CategoryBreadcrumbItem[]
  className?: string
}

export const CategoryBreadcrumbs = ({ items, className }: CategoryBreadcrumbsProps) => {
  return (
    <div
      className={cn('flex flex-wrap items-center gap-y-1 pt-0 pb-5 text-sm text-gray-500 sm:pt-4 sm:pb-7', className)}
    >
      {items.map((item, index) => (
        <div key={index} className='flex items-center'>
          {item.href ? (
            <Link href={item.href} className='hover:text-primary'>
              {item.name}
            </Link>
          ) : (
            <span>{item.name}</span>
          )}
          {index < items.length - 1 && <ChevronRight size={14} className='mx-0.5 ml-1' />}
        </div>
      ))}
    </div>
  )
}
