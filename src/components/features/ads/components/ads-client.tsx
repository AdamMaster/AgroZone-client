'use client'

import { useSearchParams } from 'next/navigation'

import { AdCard } from '@/components/features/ads/components'
import { Skeleton } from '@/components/ui'

import { useCategories } from '../../categories/hooks/use-categories'
import { ICategory } from '../../categories/types'
import { useAds } from '../hooks'

const findIdBySlug = (categories: ICategory[], slug: string | null | undefined): string | undefined => {
  if (!slug || !categories) return undefined

  for (const cat of categories) {
    if (cat.slug === slug) return cat.id
    if (cat.children && cat.children.length > 0) {
      const foundId = findIdBySlug(cat.children, slug)
      if (foundId) return foundId
    }
  }
  return undefined
}

interface AdsClientProps {
  serverSlug?: string
}

export function AdsClient({ serverSlug }: AdsClientProps) {
  const searchParams = useSearchParams()
  const { categories, isLoadingCategories } = useCategories()
  const slug = serverSlug || searchParams.get('category')
  const categoryId = findIdBySlug(categories, slug)
  const { ads, isLoadingAds } = useAds({ categoryId })
  const isComponentsLoading = isLoadingCategories || isLoadingAds

  return (
    <div className='grid grid-cols-5 gap-6'>
      {isComponentsLoading ? (
        Array.from({ length: 10 }, (_, i) => <Skeleton key={i} className='h-82 rounded-lg' />)
      ) : ads.length === 0 ? (
        <div className='col-span-5 py-10 text-center text-gray-500'>В этой категории пока нет объявлений</div>
      ) : (
        ads.map(ad => <AdCard key={ad.id} ad={ad} />)
      )}
    </div>
  )
}
