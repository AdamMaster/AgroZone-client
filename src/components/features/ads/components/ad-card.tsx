import { Heart, ImageIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import { Heading } from '@/components/ui'

import { type AdCardData } from '../types/ad.types'

interface AdCardProps {
  ad: AdCardData
}

export const AdCard = ({ ad }: AdCardProps) => {
  return (
    <article className='flex flex-col gap-2'>
      <Link href='#' className='relative block overflow-hidden rounded-xl bg-gray-100 pt-[100%]'>
        {ad.images.length > 0 ? (
          <Image src={ad.images[0]} alt={ad.title} className='h-full w-full object-cover' fill />
        ) : (
          <ImageIcon size={50} className='absolute top-[50%] left-[50%] translate-[-50%] text-gray-500' />
        )}
      </Link>
      <div className='relative'>
        <Heading
          level={2}
          className='hover:text-primary mb-0.5 w-fit text-[15px] leading-5 font-medium transition-colors'
        >
          <Link href='#'>{ad.title}</Link>
        </Heading>
        <p>
          <strong>{ad.price ? ad.price + '₽' : 'Цена договорная'}</strong>
        </p>
        <address className='text-[13px] leading-4 not-italic'>{ad.address}</address>
        <button className='absolute top-0 right-0 transition-colors hover:text-red-500'>
          <Heart size={20} className='' />
        </button>
      </div>
    </article>
  )
}
