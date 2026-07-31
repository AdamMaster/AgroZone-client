'use client'

import { ChevronLeft } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import { cn } from '@/lib/utils'

import { ICategory } from '../types/categories.types'

interface CategoryItemProps {
  category: ICategory & {
    isParent?: boolean
    isSelected?: boolean
  }
  href: string
  className?: string
  onClick?: () => void
}

export const CategoryItem = ({ category, href, className, onClick }: CategoryItemProps) => {
  const icons: Record<string, string> = {
    agrohimiya: '/images/categories/agrohimiya.jpg',
    'selskohozyajstvennye-zhivotnye-ptica-i-akvakultura':
      '/images/categories/selskohozyajstvennye-zhivotnye-ptica-i-akvakultura.jpg',
    'korma-i-kormovye-komponenty': '/images/categories/korma-i-kormovye-komponenty.jpg',
    oborudovanie: '/images/categories/oborudovanie.jpg',
    'produkty-pererabotki': '/images/categories/produkty-pererabotki.jpg',
    'svezhaya-selhozprodukciya': '/images/categories/svezhaya-selhozprodukciya.jpg',
    'selhozprodukciya-i-rastitelnoe-syryo': '/images/categories/selhozprodukciya-i-rastitelnoe-syryo.jpg',
    'selskohozyajstvennaya-tehnika': '/images/categories/selskohozyajstvennaya-tehnika.jpg',
    'tara-i-upakovka': '/images/categories/tara-i-upakovka.jpg',
    prochee: '/images/categories/prochee.jpg'
  }

  const icon = icons[category.slug]

  console.log(category)

  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        'relative flex h-[100px] max-w-[300px] gap-1 overflow-hidden rounded-lg bg-gray-100 px-5 py-4 pr-12 text-sm transition-colors hover:bg-gray-200',
        category.isSelected && 'bg-secondary hover:bg-secondary-foreground text-white',
        category.isParent && 'bg-primary hover:bg-primary-foreground text-white',
        className
      )}
    >
      {icon && (
        <Image
          src={icon}
          alt={category.name}
          width={230}
          height={230}
          className='absolute -right-2 -bottom-2 z-1 w-[210px] min-w-[190px]'
        />
      )}
      <div className='relative z-1 flex gap-1'>
        {category.isParent && <ChevronLeft size={16} />}
        {category.name}
      </div>
    </Link>
  )
}
