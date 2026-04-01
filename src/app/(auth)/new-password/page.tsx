import { Metadata } from 'next'

import { NewPasswordFrom } from '@/components/modules'

export const metadata: Metadata = {
  title: 'Новый пароль'
}

export default function NewPasswordPage() {
  return <NewPasswordFrom />
}
