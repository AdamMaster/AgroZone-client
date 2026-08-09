import type { Metadata } from 'next'

import { StaticPagePlaceholder } from '@/components/layout'

export const metadata: Metadata = {
  title: 'О компании | AgroZone'
}

export default function AboutPage() {
  return (
    <StaticPagePlaceholder
      title='О компании'
      description='Скоро здесь расскажем, как устроена AgroZone и для кого мы её делаем.'
    />
  )
}
