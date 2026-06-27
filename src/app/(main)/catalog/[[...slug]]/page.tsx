import { Metadata } from 'next'

import { AdsClient } from '@/components/features/ads/components'
import { categoriesService } from '@/components/features/categories/services'
import { ICategory } from '@/components/features/categories/types/categories.types'
import { Container } from '@/components/layout'

type PageParams = {
  slug?: string[]
}

interface Props {
  params: PageParams
}

function getSlugPath(slug?: string[]) {
  return slug?.length ? slug.join('/') : null
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slugPath = getSlugPath(params.slug)

  try {
    const categories = await categoriesService.findAll()

    const currentCategory = slugPath ? categories.find((c: ICategory) => c.slug === slugPath) : null

    if (!currentCategory) {
      return {
        title: 'Каталог объявлений | AgroZone'
      }
    }

    return {
      title: `${currentCategory.name} — купить в каталоге AgroZone`,
      description: `Выбирайте товары в категории ${currentCategory.name} на агропромышленной площадке AgroZone. Актуальные объявления от проверенных поставщиков.`
    }
  } catch {
    return {
      title: 'Каталог | AgroZone'
    }
  }
}

export default async function CatalogPage({ params }: Props) {
  const { slug } = await params

  const slugPath = getSlugPath(slug)

  return (
    <Container>
      <AdsClient serverSlug={slugPath} />
    </Container>
  )
}
