'use client'

import { Check, Crown } from 'lucide-react'

import { Button, Heading, Skeleton } from '@/components/ui'

import { useProfile } from '@/shared/hooks'

import { usePremiumCheckout } from '../hooks/use-premium-checkout'
import { PremiumStatusHandler } from './premium-status-handler'

const PREMIUM_PRICE_LABEL = '1499 ₽ за 30 дней'

const BENEFITS = [
  'Выделенное объявление',
  'Автоподнятие объявления каждые 7 дней',
  'До 15 фото к каждому объявлению вместо 5'
]

const formatDate = (value: string) => {
  return new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(value))
}

export const ContentPremium = () => {
  const { user, isLoading } = useProfile()
  const { startPremiumCheckout, isStartingPremiumCheckout } = usePremiumCheckout()

  const isPremiumActive = !!user?.premiumUntil && new Date(user.premiumUntil) > new Date()

  return (
    <div>
      <PremiumStatusHandler />

      <Heading level={2} className='mb-6'>
        Премиум Аккаунт
      </Heading>

      {isLoading ? (
        <Skeleton className='h-48 w-full max-w-md rounded-xl' />
      ) : isPremiumActive ? (
        <div className='max-w-md rounded-xl bg-amber-100 p-6'>
          <div className='mb-3 flex items-center gap-2'>
            <Crown className='size-5 text-orange-500' />
            <Heading level={4}>Премиум активен</Heading>
          </div>
          <p className='mb-6 text-sm text-gray-600'>Действует до {formatDate(user!.premiumUntil as string)}</p>
          <Button variant='outline' onClick={() => startPremiumCheckout()} disabled={isStartingPremiumCheckout}>
            Продлить ещё на 30 дней — {PREMIUM_PRICE_LABEL}
          </Button>
        </div>
      ) : (
        <div className='max-w-md rounded-xl bg-gray-50 p-6'>
          <p className='mb-4 text-2xl font-bold'>{PREMIUM_PRICE_LABEL}</p>
          <ul className='mb-6 flex flex-col gap-2'>
            {BENEFITS.map(benefit => (
              <li key={benefit} className='flex items-start gap-2 text-gray-700'>
                <Check className='text-primary mt-0.5 size-4 flex-shrink-0' strokeWidth={3} />
                {benefit}
              </li>
            ))}
          </ul>
          <Button
            size='lg'
            className='bg-orange-400 px-5 hover:bg-orange-500'
            onClick={() => startPremiumCheckout()}
            disabled={isStartingPremiumCheckout}
          >
            Оформить премиум
          </Button>
        </div>
      )}
    </div>
  )
}
