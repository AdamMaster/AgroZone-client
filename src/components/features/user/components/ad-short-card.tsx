import { Ellipsis, ImageIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import { Button, Heading } from '@/components/ui'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

import { IAd } from '../../ads/types/ad.types'

export const AdShortCard = ({ ad }: { ad: IAd }) => {
  return (
    <div className='flex gap-4'>
      <Link
        href={'#'}
        className='relative flex h-30 w-40 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg bg-slate-100'
      >
        {ad.images.length ? (
          <Image src={ad.images[0]} alt={'ad.title'} className='h-full w-full object-cover' fill />
        ) : (
          <ImageIcon className='size-8 text-gray-400' />
        )}
      </Link>

      <div className='flex flex-grow flex-col gap-1'>
        <Heading level={4}>
          <Link href={'#'} className='hover:text-primary'>
            {ad.title}
          </Link>
        </Heading>
        <p className='text-lg font-medium'>{ad.price ? `${ad.price} ₽` : 'Цена договорная'}</p>
        <p className='text-[13px] text-gray-500'>{ad.address}</p>
      </div>

      <div className='flex w-48 flex-col gap-2'>
        {ad.status === 'DRAFT' && <Button variant='outline'>Опубликовать</Button>}
        {ad.status === 'PUBLISHED' && <Button variant='outline'>Поднять просмотры</Button>}
        <div className='flex gap-1'>
          <Button className='grow' variant='outline'>
            Редактировать
          </Button>
          {ad.status === 'PUBLISHED' && (
            <DropdownMenu>
              <DropdownMenuTrigger className='bg-background! hover:bg-muted! hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50 flex w-10 items-center justify-center rounded-lg border!'>
                <Ellipsis className='size-5' />
              </DropdownMenuTrigger>
              <DropdownMenuContent className='w-40' align='end'>
                <DropdownMenuItem>Снять с публикации</DropdownMenuItem>
                <DropdownMenuItem className='text-red-500 hover:text-red-500!'>Удалить</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          {ad.status === 'PENDING' && (
            <DropdownMenu>
              <DropdownMenuTrigger className='bg-background! hover:bg-muted! hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50 flex w-10 items-center justify-center rounded-lg border!'>
                <Ellipsis className='size-5' />
              </DropdownMenuTrigger>
              <DropdownMenuContent className='w-40' align='end'>
                <DropdownMenuItem>Уже не актуально</DropdownMenuItem>
                <DropdownMenuItem className='text-red-500 hover:text-red-500!'>Удалить</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </div>
  )
}
