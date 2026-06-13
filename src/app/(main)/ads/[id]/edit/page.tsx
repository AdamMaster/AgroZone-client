import { AdEdit } from '@/components/features/ads/components/ad-edit'
import { Container } from '@/components/layout'

import { getCategories } from '@/shared/services'

interface AdEditPageProps {
  params: Promise<{ id: string }>
}

export default async function AdEditPage({ params }: AdEditPageProps) {
  const { id } = await params

  const categories = await getCategories()

  return (
    <div className='py-10'>
      <Container>
        <AdEdit id={id} categories={categories} />
      </Container>
    </div>
  )
}
