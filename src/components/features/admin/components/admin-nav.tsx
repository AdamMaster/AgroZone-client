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
      <ul className='flex flex-col gap-1'>
        {items.map(item => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <li key={item.id}>
              <Link
                href={item.href}
                className={cn(
                  'flex items-center gap-2 rounded-lg px-4 py-3 hover:bg-gray-50',
                  isActive && 'bg-gray-100'
                )}
              >
                {item.label}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
