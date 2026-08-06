'use client'

import Image from 'next/image'
import Link from 'next/link'

import { Button, Heading } from '@/components/ui'

import { usePendingAds, usePublishAd } from '../../ads/hooks'
import { RejectAdDialog } from './reject-ad-dialog'

export const ModerationQueue = () => {
  const { pendingAds, isLoading } = usePendingAds()
  const { publishAd, isLoadingPublish } = usePublishAd()

  return (
    <div className='h-full'>
      <Heading level={2} className='mb-6'>
        Объявления на модерации
      </Heading>

      {isLoading && <p className='text-sm text-gray-400'>Загрузка...</p>}

      {!isLoading && pendingAds.length === 0 && (
        <p className='text-sm text-gray-500'>Нечего проверять — очередь пуста.</p>
      )}

      <div className='flex flex-col gap-3'>
        {pendingAds.map(ad => (
          <div key={ad.id} className='flex items-center gap-4'>
            <div className='relative size-20 shrink-0 overflow-hidden rounded-lg bg-gray-100'>
              {ad.images[0] && <Image src={ad.images[0]} alt={ad.title} fill className='object-cover' sizes='80px' />}
            </div>

            <div className='min-w-0 flex-1'>
              <Link href={`/ads/${ad.id}`} target='_blank' className='hover:text-primary font-medium'>
                {ad.title}
              </Link>
              <p className='text-sm text-gray-500'>{ad.category.fullPath}</p>
              <p className='text-sm text-gray-500'>
                {ad.user.displayName ?? 'Пользователь'} · {ad.user.email ?? ad.user.phones[0]?.phone ?? '—'}
              </p>
            </div>

            <div className='flex shrink-0 gap-2'>
              <Button size='lg' disabled={isLoadingPublish} onClick={() => publishAd(ad.id)}>
                Опубликовать
              </Button>
              <RejectAdDialog adId={ad.id} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
