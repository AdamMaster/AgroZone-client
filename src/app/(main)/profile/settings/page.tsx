'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

import { SettingsNav } from '@/components/features/user/components'
import { Heading } from '@/components/ui'

import { useMediaQuery } from '@/shared/hooks'

// На десктопе сайдбар и так всегда виден рядом с контентом (см.
// profile/layout.tsx) — открывать пустой /profile/settings без выбранного
// раздела незачем, сразу уводим на "Личные данные". На мобилке сайдбара
// нет вообще, поэтому эта же страница выступает хабом: тот же SettingsNav,
// только на всю ширину экрана — именно сюда ведёт "Профиль" в
// MobileTabBar (см. PROFILE_HREF в mobile-tab-bar.tsx).
export default function SettingsPage() {
  const router = useRouter()
  const isMobile = useMediaQuery('(max-width: 767px)')

  useEffect(() => {
    if (!isMobile) router.replace('/profile/settings/general')
  }, [isMobile, router])

  if (!isMobile) return null

  return (
    <div>
      <Heading level={2} className='mb-4'>
        Профиль
      </Heading>
      <SettingsNav />
    </div>
  )
}
