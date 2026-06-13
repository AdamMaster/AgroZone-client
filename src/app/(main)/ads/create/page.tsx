import { AdCreate } from '@/components/features/ads/components'
import { Container } from '@/components/layout'

import { getCategories } from '@/shared/services'

export default async function AdCreatePage() {
  const categories = await getCategories()

  return (
    <Container className='py-10'>
      <AdCreate categories={categories} />
    </Container>
  )
}
