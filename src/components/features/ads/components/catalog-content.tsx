'use client'

import { LayoutGrid, LayoutList } from 'lucide-react'
import { useState } from 'react'

import { cn } from '@/lib/utils'

import { CategoryTitle } from '../../categories/components/category-title'
import { useCategories } from '../../categories/hooks/use-categories'
import { CatalogSort, Filter } from '../../filter/components'
import { AdCardList } from './ad-card-list'
import { AdsClient } from './ads-client'

interface CatalogContentProps {
  serverSlug?: string | null
}

export const CatalogContent = ({ serverSlug }: CatalogContentProps) => {
  const [gridLayout, setGridLayout] = useState<'cols-1' | 'cols-4'>('cols-1')
  const { categories } = useCategories()

  return (
    <div>
      <CategoryTitle categories={categories} className='mb-6' />
      <div className={cn('grid grid-cols-[320px_1fr] gap-8')}>
        <Filter categories={categories} />
        <div>
          <div className='mb-8 flex items-center justify-between gap-2.5'>
            <div className='flex items-center gap-2.5'>
              <button aria-label='Вид списком' onClick={() => setGridLayout('cols-1')}>
                <LayoutList className={cn('size-6', gridLayout === 'cols-1' ? 'text-gray-900' : 'text-gray-400')} />
              </button>
              <button aria-label='Вид сеткой' onClick={() => setGridLayout('cols-4')}>
                <LayoutGrid className={cn('size-6', gridLayout === 'cols-4' ? 'text-gray-900' : 'text-gray-400')} />
              </button>
            </div>
            <CatalogSort />
          </div>
          <AdsClient serverSlug={serverSlug} layout={gridLayout} />
        </div>
      </div>
    </div>
  )
}
