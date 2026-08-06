'use client'

import { CircleAlert, Ellipsis, ImageIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { Button, Heading, Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

import { IAd } from '../../ads/types/ad.types'
import { useActivateAd, useBumpAd, useDraftAd, useRemoveAd, useRepublishAd } from '../hooks'
import { useArchiveAd } from '../hooks/use-archive-ad'

// Поднятие платное и без ограничения на повторный клик (см. обсуждение —
// кнопка нарочно всегда активна, а не блокируется на N часов после
// последнего поднятия), поэтому вместо "заблокировано до..." тут просто
// показываем, когда объявление поднимали в последний раз.
const formatBumpDate = (value: Date | string) => {
  const date = new Date(value)
  const now = new Date()

  if (date.toDateString() === now.toDateString()) {
    return `сегодня в ${date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}`
  }

  const yesterday = new Date(now)
  yesterday.setDate(now.getDate() - 1)

  if (date.toDateString() === yesterday.toDateString()) {
    return 'вчера'
  }

  return new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long' }).format(date)
}

export const AdShortCard = ({ ad }: { ad: IAd }) => {
  const router = useRouter()
  const { removeAd, isLoadingRemove } = useRemoveAd()
  const { archiveAd, isLoadingArchive } = useArchiveAd()
  const { activateAd, isLoadingActivate } = useActivateAd()
  const { draftAd, isLoadingDraft } = useDraftAd()
  const { republishAd, isLoadingRepublishAd } = useRepublishAd()
  const { bumpAd, isLoadingBump } = useBumpAd()

  const handleEdit = () => {
    router.push(`/ads/${ad.id}/edit`)
  }

  const handleRemove = () => {
    removeAd(ad.id, {
      onSuccess: () => {
        router.push('/profile/settings/ads')
      }
    })
  }

  const handleArchive = () => {
    archiveAd(ad.id)
  }

  const handleDraft = () => {
    draftAd(ad.id)
  }

  const handlePublished = () => {
    activateAd(ad.id)
  }

  const handleRepublish = () => {
    republishAd({ id: ad.id })
  }

  const handleBump = () => {
    bumpAd(ad.id)
  }

  // Публичная страница объявления отдаёт 404 для всего, кроме PUBLISHED —
  // так что для черновиков/на модерации/архива/просроченных ведём сразу
  // на редактирование, чтобы клик по карточке никогда не был мёртвым.
  const detailHref = ad.status === 'PUBLISHED' ? `/ads/${ad.id}` : `/ads/${ad.id}/edit`

  return (
    <div className='flex gap-4'>
      <Link
        href={detailHref}
        className='relative flex h-30 w-40 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg bg-slate-100'
      >
        {ad.images.length ? (
          <Image src={ad.images[0]} alt={ad.title} className='h-full w-full object-cover' fill sizes='160px' />
        ) : (
          <ImageIcon className='size-8 text-gray-400' />
        )}
      </Link>

      <div className='flex flex-grow flex-col'>
        <div className='mb-1 flex gap-3'>
          <Heading level={4}>
            <Link href={detailHref} className='hover:text-primary'>
              {ad.title}
            </Link>
          </Heading>
          {ad.status === 'PENDING' && (
            <Tooltip>
              <TooltipTrigger>
                <span className='flex w-fit items-center rounded-2xl bg-orange-200 px-2 py-0.5 text-xs'>
                  На модерации
                </span>
              </TooltipTrigger>
              <TooltipContent>
                Мы проверяем объявление на соответствие правилам площадки. Обычно модерация занимает около 15 минут, но
                в отдельных случаях может занять до 24 часов.
              </TooltipContent>
            </Tooltip>
          )}
          {ad.status === 'EXPIRED' && (
            <span className='flex w-fit items-center rounded-2xl bg-orange-200 px-2 py-0.5 text-xs'>
              Срок действия истек
            </span>
          )}
          {ad.status === 'REJECTED' && (
            <Tooltip>
              <TooltipTrigger>
                <CircleAlert className='size-4 cursor-pointer text-amber-500' />
              </TooltipTrigger>
              <TooltipContent className='line-clamp-2'>{ad.rejectionReason}</TooltipContent>
            </Tooltip>
          )}
        </div>
        <p className='mb-3 text-lg font-bold'>{ad.price ? `${ad.price} ₽` : 'Цена договорная'}</p>
        <p className='text-[13px] text-gray-500'>{ad.address}</p>
      </div>

      <div className='flex w-48 flex-col gap-2'>
        {ad.status === 'DRAFT' ||
          (ad.status === 'ARCHIVED' && (
            <Button variant='outline' onClick={() => handlePublished()} disabled={isLoadingActivate}>
              Опубликовать
            </Button>
          ))}
        {ad.status === 'PUBLISHED' && (
          <div>
            <Button className='w-full' variant='outline' onClick={() => handleBump()} disabled={isLoadingBump}>
              Поднять объявление
            </Button>
            {ad.bumpedAt && (
              <p className='mt-1 text-center text-[11px] text-gray-500'>Поднято {formatBumpDate(ad.bumpedAt)}</p>
            )}
          </div>
        )}
        {ad.status === 'DRAFT' && (
          <Button variant='outline' onClick={() => handlePublished()} disabled={isLoadingActivate}>
            Опубликовать
          </Button>
        )}
        {ad.status === 'EXPIRED' && (
          <Button variant='outline' onClick={() => handleRepublish()} disabled={isLoadingRepublishAd}>
            Опубликовать снова
          </Button>
        )}
        <div className='flex gap-1'>
          <Button className='grow' variant='outline' onClick={() => handleEdit()}>
            Редактировать
          </Button>
          {ad.status === 'PUBLISHED' && (
            <DropdownMenu>
              <DropdownMenuTrigger className='bg-background! hover:bg-muted! hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50 flex w-10 items-center justify-center rounded-lg border!'>
                <Ellipsis className='size-5' />
              </DropdownMenuTrigger>
              <DropdownMenuContent className='w-40' align='end'>
                <DropdownMenuItem onClick={() => handleArchive()}>Снять с публикации</DropdownMenuItem>
                <DropdownMenuItem
                  className='text-red-500 hover:text-red-500!'
                  disabled={isLoadingRemove}
                  onClick={() => handleRemove()}
                >
                  Удалить
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          {ad.status === 'PENDING' && (
            <DropdownMenu>
              <DropdownMenuTrigger className='bg-background! hover:bg-muted! hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50 flex w-10 items-center justify-center rounded-lg border!'>
                <Ellipsis className='size-5' />
              </DropdownMenuTrigger>
              <DropdownMenuContent className='w-40' align='end'>
                <DropdownMenuItem onClick={() => handleArchive()} disabled={isLoadingArchive}>
                  Уже не актуально
                </DropdownMenuItem>
                <DropdownMenuItem className='text-red-500 hover:text-red-500!' onClick={() => handleRemove()}>
                  Удалить
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          {ad.status === 'REJECTED' && (
            <DropdownMenu>
              <DropdownMenuTrigger className='bg-background! hover:bg-muted! hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50 flex w-10 items-center justify-center rounded-lg border!'>
                <Ellipsis className='size-5' />
              </DropdownMenuTrigger>
              <DropdownMenuContent className='w-40' align='end'>
                <DropdownMenuItem onClick={() => handleDraft()} disabled={isLoadingDraft}>
                  В черновик
                </DropdownMenuItem>
                <DropdownMenuItem className='text-red-500 hover:text-red-500!' onClick={() => handleRemove()}>
                  Удалить
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          {ad.status === 'ARCHIVED' && (
            <DropdownMenu>
              <DropdownMenuTrigger className='bg-background! hover:bg-muted! hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50 flex w-10 items-center justify-center rounded-lg border!'>
                <Ellipsis className='size-5' />
              </DropdownMenuTrigger>
              <DropdownMenuContent className='w-40' align='end'>
                <DropdownMenuItem className='text-red-500 hover:text-red-500!' onClick={() => handleRemove()}>
                  Удалить
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          {ad.status === 'DRAFT' && (
            <DropdownMenu>
              <DropdownMenuTrigger className='bg-background! hover:bg-muted! hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50 flex w-10 items-center justify-center rounded-lg border!'>
                <Ellipsis className='size-5' />
              </DropdownMenuTrigger>
              <DropdownMenuContent className='w-40' align='end'>
                <DropdownMenuItem className='text-red-500 hover:text-red-500!' onClick={() => handleRemove()}>
                  Удалить
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </div>
  )
}
