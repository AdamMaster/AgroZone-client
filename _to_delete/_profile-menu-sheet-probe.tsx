'use client'

import { Dialog as DialogPrimitive } from '@base-ui/react/dialog'
import { Building2, Crown, FileText, HelpCircle, Info, Lock, Shield, ShieldCheck, XIcon } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Dialog, DialogClose, DialogPortal, DialogTitle } from '@/components/ui/dialog'

import { cn } from '@/lib/utils'

interface ProfileMenuItem {
  label: string
  href: string
  icon: typeof Shield
}

const ACCOUNT_ITEMS: ProfileMenuItem[] = [
  { label: 'Безопасность', href: '/profile/settings/security', icon: Shield },
  { label: 'Организация', href: '/profile/settings/company', icon: Building2 }
]

const PREMIUM_ITEM: ProfileMenuItem = { label: 'Премиум', href: '/profile/settings/premium', icon: Crown }

const INFO_ITEMS: ProfileMenuItem[] = [
  { label: 'Помощь', href: '/help', icon: HelpCircle },
  { label: 'Правила безопасности', href: '/safety', icon: ShieldCheck },
  { label: 'О компании', href: '/about', icon: Info },
  { label: 'Пользовательское соглашение', href: '/terms', icon: FileText },
  { label: 'Политика конфиденциальности', href: '/privacy', icon: Lock }
]

interface ProfileMenuSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const TRANSITION_MS = 200

export const ProfileMenuSheetProbe = ({ open, onOpenChange }: ProfileMenuSheetProps) => {
  const close = () => onOpenChange(false)

  const [mounted, setMounted] = useState(open)
  const [animateIn, setAnimateIn] = useState(false)
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => {
    window.clearTimeout(closeTimeoutRef.current)

    if (open) {
      setMounted(true)
      const frame = requestAnimationFrame(() => setAnimateIn(true))
      return () => cancelAnimationFrame(frame)
    }

    setAnimateIn(false)
    closeTimeoutRef.current = setTimeout(() => setMounted(false), TRANSITION_MS)
    return () => window.clearTimeout(closeTimeoutRef.current)
  }, [open])

  const renderItem = (item: ProfileMenuItem) => {
    const Icon = item.icon
    const isPremium = item.href === PREMIUM_ITEM.href

    return (
      <Link
        key={item.href}
        href={item.href}
        onClick={close}
        className={cn(
          'flex items-center gap-3 rounded-lg px-4 py-3 text-gray-900 hover:bg-gray-50',
          isPremium && 'text-orange-500 hover:text-orange-600'
        )}
      >
        <Icon size={20} className={cn('text-gray-400', isPremium && 'text-orange-500')} />
        {item.label}
      </Link>
    )
  }

  if (!mounted) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal keepMounted>
        <DialogPrimitive.Backdrop
          hidden={false}
          className={cn(
            'fixed inset-0 z-100 bg-black/30 transition-opacity duration-200',
            animateIn ? 'opacity-100' : 'opacity-0'
          )}
        />
        <DialogPrimitive.Popup
          hidden={false}
          className={cn(
            'bg-popover text-popover-foreground fixed top-12 right-0 bottom-0 left-0 z-100 flex flex-col gap-0 overflow-hidden rounded-t-2xl p-0 text-sm outline-none transition-transform duration-200 ease-out',
            animateIn ? 'translate-y-0' : 'translate-y-full'
          )}
        >
          <DialogTitle className='sr-only'>Меню профиля</DialogTitle>
          <DialogClose render={<Button variant='ghost' className='absolute top-2 right-2' size='icon-sm' />}>
            <XIcon />
            <span className='sr-only'>Закрыть</span>
          </DialogClose>
          <div className='flex-1 overflow-y-auto p-2'>
            <div className='flex flex-col'>{ACCOUNT_ITEMS.map(renderItem)}</div>
            <div className='my-2 border-t border-gray-100' />
            <div className='flex flex-col'>{renderItem(PREMIUM_ITEM)}</div>
            <div className='my-2 border-t border-gray-100' />
            <div className='flex flex-col'>{INFO_ITEMS.map(renderItem)}</div>
          </div>
        </DialogPrimitive.Popup>
      </DialogPortal>
    </Dialog>
  )
}
