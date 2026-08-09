import type { Metadata } from 'next'

import { StaticPagePlaceholder } from '@/components/layout'

export const metadata: Metadata = {
  title: 'Пользовательское соглашение | AgroZone'
}

export default function TermsPage() {
  return (
    <StaticPagePlaceholder
      title='Пользовательское соглашение'
      description='Здесь будет размещён полный текст пользовательского соглашения (публичной оферты), включая условия оказания платных услуг, порядок оплаты и возврата. Документ готовится к публикации.'
    />
  )
}
