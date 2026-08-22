'use client'

import { useAppModal } from '@/store'
import { Heart, Layers, LucideIcon, MessageCircle, User } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { MouseEvent } from 'react'

import { useUnreadNotificationsCount } from '@/components/features/notifications/hooks'

import { useProfile } from '@/shared/hooks'

import { cn } from '@/lib/utils'

interface TabItem {
  label: string
  icon: LucideIcon
  href: string
}

const PROFILE_HREF = '/profile/settings/general'

// Пункты нижней панели — сознательно без "Главная"/"Поиск": вход в
// категории и поиск теперь всегда доступны через верхнюю мобильную панель
// (поиск + фильтр) на любой странице, отдельная вкладка для этого не нужна
// (см. обсуждение с пользователем про адаптив шапки — мегаменю на мобилке
// убрано полностью). Роуты и иконки продублированы из SettingsNav
// (../../features/user/components/settings-nav.tsx) — это те же самые
// разделы профиля, просто вынесенные в постоянно видимую нижнюю панель.
const TABS: TabItem[] = [
  { label: 'Избранное', icon: Heart, href: '/profile/settings/favorites' },
  { label: 'Объявления', icon: Layers, href: '/profile/settings/ads' },
  { label: 'Сообщения', icon: MessageCircle, href: '/profile/settings/messages' },
  { label: 'Профиль', icon: User, href: PROFILE_HREF }
]

// Значок непрочитанных уведомлений — отдельный компонент, а не просто
// условный рендер счётчика внутри MobileTabBar, чтобы хук с поллингом
// (useUnreadNotificationsCount) монтировался только когда пользователь
// авторизован — тот же приём, что и у NotificationBell/HeaderActions на
// десктопе (там компонент с этим хуком тоже рендерится только для user).
const ProfileTabBadge = () => {
  const { unreadCount } = useUnreadNotificationsCount()

  if (unreadCount <= 0) return null

  return (
    <span className='bg-primary absolute -top-1 -right-2 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-medium text-white'>
      {unreadCount > 9 ? '9+' : unreadCount}
    </span>
  )
}

// Нижняя таб-панель — видна только на мобилке (md:hidden), на десктопе
// вся эта навигация остаётся в HeaderActions, как и раньше. Разделы
// (Избранное/Объявления/Сообщения/Профиль) на этом уровне требуют
// авторизации так же, как и на десктопе — там для гостя эти ссылки просто
// не показываются вовсе (см. HeaderActions), но панель внизу должна быть
// одной и той же по составу вкладок на любой странице, поэтому вместо
// скрытия вкладок для гостя клик по любой из них открывает окно входа.
export const MobileTabBar = () => {
  const pathname = usePathname()
  const { user } = useProfile()
  const { onOpen } = useAppModal()

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (!user) {
      event.preventDefault()
      onOpen()
    }
  }

  return (
    <nav
      className='fixed inset-x-0 bottom-0 z-40 flex items-stretch justify-around border-t bg-white pb-[env(safe-area-inset-bottom)] md:hidden'
      aria-label='Основная навигация'
    >
      {TABS.map(tab => {
        const Icon = tab.icon
        const isActive = pathname === tab.href

        return (
          <Link
            key={tab.href}
            href={tab.href}
            onClick={handleClick}
            className={cn(
              'flex h-14 flex-1 flex-col items-center justify-center gap-0.5 text-[11px] text-gray-500',
              isActive && 'text-primary'
            )}
          >
            <span className='relative inline-flex'>
              <Icon className={cn('size-5', isActive ? 'text-primary' : 'text-gray-400')} />
              {tab.href === PROFILE_HREF && user && <ProfileTabBadge />}
            </span>
            {tab.label}
          </Link>
        )
      })}
    </nav>
  )
}
