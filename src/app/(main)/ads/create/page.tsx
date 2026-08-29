import { Suspense } from 'react'

import { AdCreate } from '@/components/features/ads/components'
import { categoriesService } from '@/components/features/categories/services'
import { Container } from '@/components/layout'

export default async function AdCreatePage() {
  const categories = await categoriesService.findAll()

  return (
    <Container className='pt-0 sm:pt-10'>
      <Suspense fallback={null}>
        <AdCreate categories={categories} />
      </Suspense>
    </Container>
  )
}
