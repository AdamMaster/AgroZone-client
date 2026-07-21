'use client'

import { useSearchParams } from 'next/navigation'
import { useMemo } from 'react'

import { AdCard } from '@/components/features/ads/components'
import { Skeleton } from '@/components/ui'

import { cn } from '@/lib/utils'

import { CategoryTitle } from '../../categories/components/category-title'
import { useCategories } from '../../categories/hooks/use-categories'
import { ICategory } from '../../categories/types'
import { useAds } from '../hooks'

const SKELETON_COUNT = 10

const findIdBySlug = (categories: ICategory[], slug?: string | null): string | undefined => {
  if (!slug) return

  for (const category of categories) {
    if (category.slug === slug) {
      return category.id
    }

    if (category.children?.length) {
      const found = findIdBySlug(category.children, slug)
      if (found) return found
    }
  }

  return
}

interface AdsClientProps {
  serverSlug?: string | null
  className?: string
}

export function AdsClient({ serverSlug, className }: AdsClientProps) {
  const searchParams = useSearchParams()

  const { categories, isLoadingCategories } = useCategories()

  const searchQuery = searchParams.get('search') ?? undefined

  const slug = serverSlug?.split('/').at(-1) ?? searchParams.get('category') ?? undefined

  const categoryId = useMemo(() => {
    if (!slug) return undefined
    return findIdBySlug(categories, slug)
  }, [categories, slug])

  const { ads, isLoadingAds } = useAds({
    categoryId,
    search: searchQuery
  })

  if (isLoadingCategories || isLoadingAds) {
    return (
      <div className={cn(className, 'grid grid-cols-5 gap-6')}>
        {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
          <Skeleton key={i} className='h-82 rounded-lg' />
        ))}
      </div>
    )
  }

  if (!ads.length) {
    return <div className='py-10 text-center text-gray-500'>В этой категории пока нет объявлений</div>
  }

  return (
    <div>
      <CategoryTitle categories={categories} className='mt-4 mb-6' />
      <div className={cn('grid grid-cols-5 gap-6', className)}>
        {ads.map(ad => (
          <AdCard key={ad.id} ad={ad} />
        ))}
      </div>
    </div>
  )
}
