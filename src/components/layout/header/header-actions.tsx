'use client'
import { useAuthModal } from '@/store'
import { Lock, Plus } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'

import { AuthModal } from '@/components/modals'

interface Props {
  className?: string
}

export const HeaderActions: React.FC<Props> = () => {
  const { onOpen } = useAuthModal()

  const searchParams = useSearchParams()

  useEffect(() => {
    if (searchParams.get('auth') === 'true') {
      const timer = setTimeout(() => {
        onOpen()
      }, 0)

      return () => clearTimeout(timer)
    }
  }, [searchParams])

  return (
    <>
      <div className='flex items-center'>
        <button
          className='flex items-center gap-1.5 px-3 py-1 text-sm text-gray-500 transition-colors duration-200 hover:text-black'
          onClick={() => onOpen()}
        >
          <Lock className='h-4 w-4' />
          Вход и регистрация
        </button>
        <button
          className='flex items-center gap-1.5 px-3 py-1 text-sm text-gray-500 transition-colors duration-200 hover:text-black'
          onClick={() => onOpen()}
        >
          <Plus className='h-4 w-4' />
          Разместить объявление
        </button>
      </div>
    </>
  )
}
