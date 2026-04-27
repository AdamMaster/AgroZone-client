'use client'
import { useAuthModal } from '@/store'
import { Lock, Plus } from 'lucide-react'
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
          <ActionButton>
            <Plus className='h-4 w-4' />
            Разместить объявление
          </ActionButton>
          <UserButton className='ml-2' user={user} />
        </div>
      )}
    </>
  )
}

interface ActionButtonProps {
  onClick?: () => void
}
const ActionButton = ({ children, onClick }: PropsWithChildren<ActionButtonProps>) => {
  return (
    <button
      className='flex items-center gap-1.5 px-3 py-1 text-sm text-gray-900 transition-colors duration-200 hover:text-black'
      onClick={onClick}
    >
      {children}
    </button>
  )
}
