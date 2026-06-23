import { AdCard } from '@/components/features/ads/components'
import { adsService } from '@/components/features/ads/services'
import { AdCardData } from '@/components/features/ads/types/ad.types'
import { CategoryGrid } from '@/components/features/categories/components'
import { Container } from '@/components/layout'

import { getCategories } from '@/shared/services'

export default async function Home() {
  const categories = await getCategories()
  const ads = (await adsService.findAll()) || []

  return (
    <div className='pt-4'>
      <Container>
        <CategoryGrid categories={categories} className='mb-6' />
        <div className='grid grid-cols-5 gap-6'>
          {ads && ads.map((ad: AdCardData) => <AdCard key={ad.id} ad={ad} />)}
        </div>
      </Container>
    </div>
  )
}
