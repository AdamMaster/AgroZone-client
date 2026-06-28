'use client'
import { useAuthModal } from '@/store'
import { Bell, Heart, Layers, Lock, Plus } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import React, { PropsWithChildren, ReactNode, useEffect, useState } from 'react'
import { toast } from 'sonner'

import { UserButton } from '@/components/features/user/components'
import { AuthModal } from '@/components/modals/auth'

import { useProfile } from '@/shared/hooks'

interface Props {
  className?: string
}

export const HeaderActions: React.FC<Props> = () => {
  const { onOpen } = useAuthModal()
  const { user, isLoading } = useProfile()

  const searchParams = useSearchParams()

  useEffect(() => {
    const auth = searchParams.get('auth')
    const reason = searchParams.get('reason')

    if (auth === 'true') {
      if (reason === 'reset') {
        onOpen('login-after-reset')
      } else {
        onOpen('login')
      }
    }
  }, [searchParams])

  return (
    <>
      {!user ? (
        <div className='flex items-center'>
          <ActionButton onClick={() => onOpen()}>
            <Lock className='h-4 w-4' />
            Вход и регистрация
          </ActionButton>
          <ActionButton onClick={() => onOpen()}>
            <Plus className='h-4 w-4' />
            Разместить объявление
          </ActionButton>
        </div>
      ) : (
        <div className='flex items-center'>
          <ActionButton isLink={true} href='/ads/create'>
            <Plus className='h-4 w-4' />
            Разместить объявление
          </ActionButton>
          <ActionButton isLink={true} href='/profile/settings/ads'>
            <Layers className='h-4 w-4' />
            Мои объявления
          </ActionButton>
          <Link href='/profile/settings/favorites' className='px-2 py-1'>
            <Heart className='size-6 fill-gray-300 text-gray-300 hover:fill-gray-400 hover:text-gray-400' />
          </Link>
          <button className='px-2 py-1'>
            <Bell className='size-6 fill-gray-300 text-gray-300 hover:fill-gray-400 hover:text-gray-400' />
          </button>
          <UserButton className='ml-2' user={user} />
        </div>
      )}
    </>
  )
}

interface ActionButtonProps {
  isLink?: boolean
  href?: string
  onClick?: () => void
}
const ActionButton = ({ children, isLink = false, href, onClick }: PropsWithChildren<ActionButtonProps>) => {
  if (isLink) {
    return (
      <Link
        href={isLink && href!}
        className='hover:text-primary flex items-center gap-1.5 px-3 py-1 text-sm text-gray-900 transition-colors duration-200'
      >
        {children}
      </Link>
    )
  }

  return (
    <button
      className='hover:text-primary flex items-center gap-1.5 px-3 py-1 text-sm text-gray-900 transition-colors duration-200'
      onClick={onClick}
    >
      {children}
    </button>
  )
}
