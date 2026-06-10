import { FormCreateAd } from '@/components/features/ads/components'
import { Container } from '@/components/layout'
import { Heading } from '@/components/ui'

async function getCategories() {
  const res = await fetch('http://localhost:4000/categories', {
    next: { revalidate: 3600 }
  })

  if (!res.ok) {
    throw new Error('Не удалось загрузить категории')
  }

  return res.json()
}

export default async function AdCreatePage() {
  const categories = await getCategories()

  return (
    <Container className='py-10'>
      <FormCreateAd categories={categories} />
    </Container>
  )
}
