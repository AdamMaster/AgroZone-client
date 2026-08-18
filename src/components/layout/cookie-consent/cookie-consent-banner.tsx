'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

import { Button } from '@/components/ui'

import { useCookieConsentStore } from '@/store'

export const CookieConsentBanner = () => {
  const { status, accept, decline } = useCookieConsentStore()

  // Значение из persist (localStorage) появляется только после гидратации
  // на клиенте. До этого момента store.status ещё равен дефолтному null и
  // на сервере, и на клиенте при первом рендере — если рендерить баннер
  // сразу по условию status === null, он на долю секунды мигал бы даже у
  // тех, кто уже сделал выбор раньше. Поэтому ждём монтирования.
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || status !== null) {
    return null
  }

  return (
    <div className='bg-background fixed inset-x-0 bottom-0 z-50 border-t p-4 shadow-lg'>
      <div className='mx-auto flex max-w-6xl flex-col items-center gap-4 sm:flex-row sm:justify-between'>
        <p className='text-sm text-gray-600'>
          Мы используем cookie для корректной работы сайта и авторизации. Продолжая пользоваться сайтом, вы соглашаетесь
          с их использованием — подробнее в{' '}
          <Link href='/privacy' className='text-primary underline'>
            политике конфиденциальности
          </Link>
          .
        </p>
        <div className='flex shrink-0 gap-2'>
          <Button variant='outline' size='lg' onClick={decline}>
            Отклонить
          </Button>
          <Button variant='secondary' size='lg' onClick={accept}>
            Принять
          </Button>
        </div>
      </div>
    </div>
  )
}
