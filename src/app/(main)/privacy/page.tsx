import type { Metadata } from 'next'

import { StaticPagePlaceholder } from '@/components/layout'

export const metadata: Metadata = {
  title: 'Политика конфиденциальности | AgroZone'
}

export default function PrivacyPage() {
  return (
    <StaticPagePlaceholder
      title='Политика конфиденциальности'
      description='Здесь будет размещена политика обработки персональных данных в соответствии с 152-ФЗ. Документ готовится к публикации.'
    />
  )
}
