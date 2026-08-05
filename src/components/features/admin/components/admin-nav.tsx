'use client'

import { ArrowLeft, Flag, ShieldCheck } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { cn } from '@/lib/utils'

// По той же стилистике, что и SettingsNav (см.
// components/features/user/components/settings-nav.tsx) — отдельный
// компонент, а не переиспользование SettingsNav, потому что аудитория и
// набор разделов у админки совсем другие.
const items = [
  { label: 'Модерация объявлений', icon: ShieldCheck, id: 'moderation', href: '/admin/moderation' },
  { label: 'Жалобы', icon: Flag, id: 'reports', href: '/admin/reports' }
]

export const AdminNav = () => {
  const pathname = usePathname()

  return (
    <nav>
      <Link href='/' className='mb-4 flex items-center gap-2 px-4 text-sm text-gray-500 hover:text-gray-700'>
        <ArrowLeft className='size-4' />
        Вернуться на сайт
      </Link>

      <ul className='flex flex-col'>
        {items.map(item => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <li key={item.id}>
              <Link
                href={item.href}
                className={cn(
                  'hover:text-primary flex items-center gap-2 rounded-lg px-4 py-2 text-gray-900',
                  isActive && 'text-primary bg-gray-50'
                )}
              >
                <Icon size={18} className={cn('text-gray-400', isActive && 'text-primary')} />
                {item.label}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
