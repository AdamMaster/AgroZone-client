'use client'

import { useAppModal } from '@/store'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { JSX, MouseEvent, SVGProps } from 'react'

import { useUnreadNotificationsCount } from '@/components/features/notifications/hooks'
import {
  ChatCircleFillIcon,
  HeartFillIcon,
  HouseFillIcon,
  StackFillIcon,
  UserFillIcon
} from '@/components/icons/phosphor-fill-icons'

import { useProfile } from '@/shared/hooks'

import { cn } from '@/lib/utils'

interface TabItem {
  label: string
  icon: (props: SVGProps<SVGSVGElement>) => JSX.Element
  href: string
}

// На мобилке сайдбара (SettingsNav) в профиле нет вообще — весь список
// разделов виден только тут либо на самой /profile/settings (см. её
// page.tsx — там он же, во весь экран). Поэтому "Профиль" ведёт на
// индекс, а не сразу на "Личные данные" — иначе с телефона было бы не
// попасть в Безопасность, Организацию, Уведомления и Премиум.
const PROFILE_HREF = '/profile/settings'

// Пункты нижней панели — сознательно без "Главная"/"Поиск": вход в
// категории и поиск теперь всегда доступны через верхнюю мобильную панель
// (поиск + фильтр) на любой странице, отдельная вкладка для этого не нужна
// (см. обсуждение с пользователем про адаптив шапки — мегаменю на мобилке
// убрано полностью). Роуты продублированы из SettingsNav
// (../../features/user/components/settings-nav.tsx) — это те же самые
// разделы профиля, просто вынесенные в постоянно видимую нижнюю панель.
// Иконки — закрашенные (Phosphor Fill, см. components/icons/phosphor-fill-icons.tsx),
// а не lucide: контурные не понравились пользователю по виду, заливка
// через fill у lucide тоже не понравилась. HouseFillIcon там же — готова
// под будущую вкладку "Главная", которую пользователь добавит сам.
const TABS: TabItem[] = [
  { label: 'Главная', icon: HouseFillIcon, href: '/' },
  { label: 'Избранное', icon: HeartFillIcon, href: '/profile/settings/favorites' },
  { label: 'Объявления', icon: StackFillIcon, href: '/profile/settings/ads' },
  { label: 'Сообщения', icon: ChatCircleFillIcon, href: '/profile/settings/messages' },
  { label: 'Профиль', icon: UserFillIcon, href: PROFILE_HREF }
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
      className='fixed inset-x-0 bottom-0 z-40 flex items-stretch justify-around border-t bg-neutral-800 pb-[env(safe-area-inset-bottom)] md:hidden'
      aria-label='Основная навигация'
    >
      {TABS.map(tab => {
        const Icon = tab.icon
        // Для "Профиль" подсвечиваем вкладку на любом /profile/settings/...,
        // а не только на самом индексе — иначе при переходе в конкретный
        // раздел (например Безопасность) вкладка гасла бы, хотя
        // пользователь всё ещё внутри профиля.
        const isActive = tab.href === PROFILE_HREF ? pathname.startsWith('/profile/settings') : pathname === tab.href

        return (
          <Link
            key={tab.href}
            href={tab.href}
            onClick={handleClick}
            className={cn(
              'flex h-14 flex-1 flex-col items-center justify-center gap-0.5 text-[11px] text-white',
              isActive && 'text-primary text-primary-light'
            )}
          >
            <span className='relative inline-flex'>
              <Icon className={cn('size-5', isActive ? 'text-primary-light' : 'text-white')} />
              {tab.href === PROFILE_HREF && user && <ProfileTabBadge />}
            </span>
            {tab.label}
          </Link>
        )
      })}
    </nav>
  )
}
