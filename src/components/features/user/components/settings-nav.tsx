'use client'

import { Bell, Building2, Heart, Layers, Shield, User } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { cn } from '@/lib/utils'

const items = [
  { label: 'Личные данные', icon: User, id: 'general', href: '/profile/settings/general' },
  { label: 'Безопасность', icon: Shield, id: 'security', href: '/profile/settings/security' },
  { label: 'Мои объявления', icon: Layers, id: 'ads', href: '/profile/settings/ads' },
  { label: 'Избранное', icon: Heart, id: 'favorites', href: '/profile/settings/favorites' },
  { label: 'Организация', icon: Building2, id: 'company', href: '/profile/settings/company' },
  { label: 'Уведомления', icon: Bell, id: 'notifications', href: '/profile/settings/notifications' }
]

export const SettingsNav = () => {
  const pathname = usePathname()

  return (
    <nav>
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
