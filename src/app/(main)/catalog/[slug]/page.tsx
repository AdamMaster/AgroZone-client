import { Metadata } from 'next'

import { AdsClient } from '@/components/features/ads/components'
import { categoriesService } from '@/components/features/categories/services'
import { ICategory } from '@/components/features/categories/types/categories.types'
import { Container } from '@/components/layout'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params

  try {
    const categories = await categoriesService.findAll()
    const currentCategory = categories.find((cat: ICategory) => cat.slug === slug)

    if (!currentCategory) {
      return { title: 'Каталог объявлений | AgroZone' }
    }

    return {
      title: `${currentCategory.name} — купить в каталоге AgroZone`,
      description: `Выбирайте товары в категории ${currentCategory.name} на агропромышленной площадке AgroZone. Актуальные объявления от проверенных поставщиков.`
    }
  } catch (e) {
    return { title: 'Каталог | AgroZone' }
  }
}

export default async function CatalogPage({ params }: Props) {
  const { slug } = await params
  return (
    <Container>
      <AdsClient serverSlug={slug} />
    </Container>
  )
}
