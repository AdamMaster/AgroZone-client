import { ImageIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import { Heading } from '@/components/ui'

import { useAddFavorite, useRemoveFavorite } from '../hooks'
import { type AdCardData, IAd } from '../types/ad.types'
import { FavoriteButton } from './favorite-button'

interface AdFavoriteCardProps {
  favorite: AdCardData
}

export const AdFavoriteCard = ({ favorite }: AdFavoriteCardProps) => {
  const { isAddingFavorite } = useAddFavorite()
  const { removeFavorite, isRemovingFavorite } = useRemoveFavorite()

  const onClickFavorite = (id: string) => {
    removeFavorite(id)
  }

  return (
    <div className='flex gap-4'>
      <Link
        href={'#'}
        className='relative flex h-30 w-40 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg bg-slate-100'
      >
        {favorite.images.length ? (
          <Image
            src={favorite.images?.[0] || ''}
            alt={favorite.title}
            className='h-full w-full object-cover'
            fill
            sizes='160px'
          />
        ) : (
          <ImageIcon className='size-8 text-gray-400' />
        )}
      </Link>

      <div className='flex flex-grow flex-col'>
        <div className='relative mb-1 flex gap-3'>
          <Heading level={4} className='font-medium'>
            <Link href={'#'} className='hover:text-primary'>
              {favorite.title}
            </Link>
          </Heading>
          <FavoriteButton
            onClick={() => removeFavorite(favorite.id)}
            isFavorite={true}
            isLoading={isRemovingFavorite}
          />
        </div>
        <p className='mb-3 text-lg font-bold'>{favorite.price ? `${favorite.price} ₽` : 'Цена договорная'}</p>
        <p className='text-[13px] text-gray-500'>{favorite.address}</p>
      </div>

      <div className='flex w-48 flex-col gap-2'></div>
    </div>
  )
}
