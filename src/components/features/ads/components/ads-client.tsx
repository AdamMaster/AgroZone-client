'use client'

import { useSearchParams } from 'next/navigation'
import { useMemo } from 'react'

import { AdCard } from '@/components/features/ads/components'
import { Skeleton } from '@/components/ui'

import { useCategories } from '../../categories/hooks/use-categories'
import { ICategory } from '../../categories/types'
import { useAds } from '../hooks'

const SKELETON_COUNT = 10

const findIdByFullPath = (categories: ICategory[], fullPath?: string | null): string | undefined => {
  if (!fullPath) return

  for (const category of categories) {
    if (category.fullPath === fullPath) {
      return category.id
    }

    if (category.children?.length) {
      const found = findIdByFullPath(category.children, fullPath)
      if (found) return found
    }
  }

  return
}

export function AdsClient({ serverSlug }: { serverSlug?: string | null }) {
  const searchParams = useSearchParams()

  const currentPath = serverSlug ?? searchParams.get('category') ?? undefined

  const { categories, isLoadingCategories } = useCategories()

  const searchQuery = searchParams.get('search') ?? undefined

  const categoryId = useMemo(() => {
    if (!currentPath) return undefined
    return findIdByFullPath(categories, currentPath)
  }, [categories, currentPath])

  const { ads, isLoadingAds } = useAds({
    categoryId,
    search: searchQuery
  })

  if (isLoadingCategories || isLoadingAds) {
    return (
      <div className='grid grid-cols-5 gap-6'>
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
    <div className='grid grid-cols-5 gap-6'>
      {ads.map(ad => (
        <AdCard key={ad.id} ad={ad} />
      ))}
    </div>
  )
}
