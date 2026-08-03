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
  // Ключи — реальные slug'и категорий (после переименования на короткие
  // названия slug пересчитывается заново), значения — пути к уже
  // существующим файлам картинок, их переименовывать не понадобилось.
  const icons: Record<string, string> = {
    agrohimiya: '/images/categories/agrohimiya.jpg',
    'sh-zhivotnye-i-ptica': '/images/categories/selskohozyajstvennye-zhivotnye-ptica-i-akvakultura.jpg',
    'korma-i-komponenty': '/images/categories/korma-i-kormovye-komponenty.jpg',
    oborudovanie: '/images/categories/oborudovanie.jpg',
    'produkty-pererabotki': '/images/categories/produkty-pererabotki.jpg',
    'svezhaya-selhozprodukciya': '/images/categories/svezhaya-selhozprodukciya.jpg',
    agrokultury: '/images/categories/selhozprodukciya-i-rastitelnoe-syryo.jpg',
    'sh-tehnika': '/images/categories/selskohozyajstvennaya-tehnika.jpg',
    'tara-i-upakovka': '/images/categories/tara-i-upakovka.jpg',
    prochee: '/images/categories/prochee.jpg'
    // 'zhivotnoe-syryo' (бывш. «Сырьё животного происхождения») — картинки для
    // этой категории пока нет вообще, ни под старым, ни под новым именем.
  }

  const isTopLevelCard = category.level === 0 && !category.isParent
  const icon = isTopLevelCard ? icons[category.slug] : undefined

  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        'hover:ring-primary relative flex max-w-[300px] gap-1 overflow-hidden rounded-lg bg-gray-100 text-sm transition-colors hover:ring-1',
        isTopLevelCard ? 'h-[100px] px-5 py-4 pr-12' : 'px-4 py-2.5',
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
      <div className={cn('relative z-1 flex gap-1', !isTopLevelCard && 'items-center')}>
        {category.isParent && <ChevronLeft size={16} />}
        {category.name}
      </div>
    </Link>
  )
}
