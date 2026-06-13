'use client'

import Image from 'next/image'
import Link from 'next/link'

import { Button, Heading, Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui'

import { cn } from '@/lib/utils'

import { AdShortCard } from '../../ads/components'
import { useMyAds } from '../../ads/hooks'

export const ContentAds = () => {
  const { ads, isLoading } = useMyAds()

  if (isLoading) return <div>Загрузка...</div>

  const publishedAds = ads.filter(ad => ad.status === 'PUBLISHED' || ad.status === 'PENDING')
  const archivedAds = ads.filter(ad => ad.status === 'ARCHIVED')
  const draftAds = ads.filter(ad => ad.status === 'DRAFT')
  const rejectedAds = ads.filter(ad => ad.status === 'REJECTED')

  const tabs = [
    { value: 'published', label: 'Опубликованные', ads: publishedAds },
    { value: 'archived', label: 'Архив', ads: archivedAds },
    { value: 'draft', label: 'Черновики', ads: draftAds },
    { value: 'rejected', label: 'Отклонённые', ads: rejectedAds }
  ].filter(tab => tab.ads.length > 0)

  if (!ads?.length) {
    return (
      <div className='flex flex-col items-center justify-center text-center'>
        <Heading className='mb-2 font-semibold' level={3}>
          У вас нет объявлений
        </Heading>
        <p className='mb-4 leading-5 text-gray-500'>
          Разместите первое объявление
          <br /> и найдите покупателей по всей России.
        </p>
        <Link
          href='/ads/create'
          className='hover:bg-primary-foreground bg-primary mb-8 flex h-10 items-center justify-center rounded-lg px-4 text-white transition-colors'
        >
          Разместить объявление
        </Link>
        <Image src='/images/empty-box.svg' width={250} height={250} alt='Нет объявлений' />
      </div>
    )
  }

  return (
    <div className='m max-w-[800px]'>
      <Tabs defaultValue='published'>
        <TabsList className='mb-4' variant='line'>
          {tabs.map(tab => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.label}
              <ItemsCount count={tab.ads.length} />
            </TabsTrigger>
          ))}
        </TabsList>
        {tabs.map(tab => (
          <TabsContent className='grid grid-cols-1 gap-6' key={tab.value} value={tab.value}>
            {tab.ads.map(ad => (
              <AdShortCard key={ad.id} ad={ad} />
            ))}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}

function ItemsCount({ count }: { count: number }) {
  return (
    <div className='flex size-4.5 items-center justify-center rounded-full bg-gray-200 text-xs leading-[1] font-medium'>
      {count}
    </div>
  )
}
