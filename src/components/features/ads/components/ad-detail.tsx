'use client'

import { Crown, ImageIcon, MapPin, Phone } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useRef, useState } from 'react'
import Lightbox from 'yet-another-react-lightbox'
import Zoom from 'yet-another-react-lightbox/plugins/zoom'

import { Avatar, AvatarFallback, AvatarImage, Button, ButtonBack, Heading } from '@/components/ui'

import { PRICE_UNITS } from '@/shared/constants/units'
import { USER_TYPE_LABELS } from '@/shared/constants/user-types'
import { useProfile } from '@/shared/hooks'
import { formatPhoneNumber, isFutureDate, isPremiumActive, pluralizeRu } from '@/shared/utils'

import { cn } from '@/lib/utils'

import { UserAvatar } from '../../user/components'
import { AD_PRICE_HIGHLIGHT_CLASS } from '../constants/ad-services.constants'
import { useAd, useAddFavorite, useRemoveFavorite } from '../hooks'
import { IAd, ICategoryFeature } from '../types/ad.types'
import { AdBadgeChip } from './ad-badge-chip'
import { AdServicesStatusHandler } from './ad-services-status-handler'
import { AdViewsStats } from './ad-views-stats'
import { BumpStatusHandler } from './bump-status-handler'
import { CategoryBreadcrumbItem, CategoryBreadcrumbs } from './category-breadcrumbs'
import { FavoriteButton } from './favorite-button'
import { ReportAdDialog } from './report-ad-dialog'

import 'yet-another-react-lightbox/styles.css'

interface AdDetailProps {
  // Объявление, полученное на сервере (SSR) — используется как initialData
  // для react-query, чтобы не делать повторный запрос при первом рендере.
  ad: IAd
  categoryFeatures?: ICategoryFeature[]
  // Путь категорий до текущей (родители → сама категория) с готовыми
  // ссылками на каталог — считается на сервере по ad.categoryId.
  categoryPath?: CategoryBreadcrumbItem[]
}

const formatDate = (value: Date | string | null) => {
  if (!value) return null

  return new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(value))
}

const formatFeatureValue = (feature: ICategoryFeature, value: unknown): string | null => {
  if (value === null || value === undefined || value === '') return null

  if (feature.type === 'BOOLEAN') return value ? 'Да' : 'Нет'
  if (Array.isArray(value)) return value.length ? value.join(', ') : null

  return String(value)
}

export const AdDetail = ({ ad: initialAd, categoryFeatures = [], categoryPath = [] }: AdDetailProps) => {
  const router = useRouter()
  const { user } = useProfile()
  const { ad } = useAd(initialAd.id, initialAd)

  const galleryRef = useRef<HTMLDivElement>(null)

  const [activeImage, setActiveImage] = useState(0)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)
  const [isPhoneRevealed, setIsPhoneRevealed] = useState(false)

  const { addFavorite, isAddingFavorite } = useAddFavorite()
  const { removeFavorite, isRemovingFavorite } = useRemoveFavorite()

  const scrollToImage = (index: number) => {
    const slide = galleryRef.current?.children[index] as HTMLElement | undefined
    // behavior: 'auto' — без плавной прокрутки (аналог swipe: 0 в
    // Lightbox выше), клик по миниатюре сразу переключает фото, без
    // анимации скольжения.
    slide?.scrollIntoView({ behavior: 'auto', inline: 'center', block: 'nearest' })
  }

  useEffect(() => {
    const container = galleryRef.current
    if (!container) return

    let frame: number

    const handleScroll = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const index = Math.round(container.scrollLeft / container.clientWidth)
        setActiveImage(prev => (prev === index ? prev : index))
      })
    }

    container.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      container.removeEventListener('scroll', handleScroll)
      cancelAnimationFrame(frame)
    }
  }, [])

  const isOwner = !!user && user.id === ad.userId

  // isFavorite больше не отдельный локальный стейт — раньше он менялся тут
  // же безусловно на каждый клик (setIsFavorite(prev => !prev)), независимо
  // от результата мутации, из-за чего при ошибке (например, у
  // неавторизованного пользователя) сердечко оставалось закрашенным,
  // несмотря на всплывший тост с ошибкой. Теперь значение берётся напрямую
  // из ad.isFavorite (кэш react-query, ключ ['ad-public', id] — см.
  // use-ad.ts), который сами хуки избранного корректно оптимистично
  // обновляют и откатывают при ошибке (см. use-add-favorite.ts /
  // use-remove-favorite.ts).
  const onClickFavorite = () => {
    if (ad.isFavorite) {
      removeFavorite(ad.id)
    } else {
      addFavorite(ad.id)
    }
  }

  const features = (ad.features as unknown as Record<string, unknown>) || {}

  const filledFeatures = categoryFeatures
    .map(feature => ({
      feature,
      value: formatFeatureValue(feature, features[feature.name])
    }))
    .filter((item): item is { feature: ICategoryFeature; value: string } => item.value !== null)

  const publishedDate = formatDate(ad.publishedAt)

  const slides = useMemo(() => ad.images.map(src => ({ src })), [ad.images])

  const closeLightbox = () => {
    setIsLightboxOpen(false)
    scrollToImage(activeImage)
  }

  const isSellerPremium = isPremiumActive(ad.user?.premiumUntil)
  const isPriceHighlighted = isFutureDate(ad.priceHighlightUntil) || isSellerPremium
  const isBadgeShown = isFutureDate(ad.badgeUntil) && !!ad.badge

  return (
    <div className='relative mt-6 max-w-[950px]'>
      <BumpStatusHandler adId={ad.id} />
      <AdServicesStatusHandler adId={ad.id} />
      <div className='absolute top-0 -left-18 h-full'>
        <ButtonBack onClick={() => router.back()} />
      </div>
      <CategoryBreadcrumbs className='mb-2' items={[{ name: 'Объявления', href: '/catalog' }, ...categoryPath]} />

      <Heading level={1} className='mb-6'>
        {ad.title}
      </Heading>
      {isOwner && <AdViewsStats adId={ad.id} />}

      <div className='mb-8 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_360px]'>
        <div>
          {ad.images.length > 0 ? (
            <div className='relative mb-2'>
              {isBadgeShown && <AdBadgeChip badge={ad.badge!} className='absolute top-2 left-2 z-10' />}
              <div
                ref={galleryRef}
                className='flex snap-x snap-mandatory [scrollbar-width:none] overflow-x-auto overscroll-x-contain rounded-xl bg-gray-100 [&::-webkit-scrollbar]:hidden'
              >
                {ad.images.map((image, index) => (
                  <button
                    key={image + index}
                    type='button'
                    onClick={() => setIsLightboxOpen(true)}
                    className='relative w-full flex-shrink-0 snap-center pt-[66%]'
                  >
                    <Image
                      src={image}
                      alt={`${ad.title} — фото ${index + 1}`}
                      className='h-full w-full object-cover'
                      fill
                      sizes='(min-width: 1024px) 640px, 100vw'
                      priority={index === 0}
                    />
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className='relative mb-2 overflow-hidden rounded-xl bg-gray-100 pt-[66%]'>
              <ImageIcon size={64} className='absolute top-1/2 left-1/2 -translate-1/2 text-gray-400' />
            </div>
          )}

          {ad.images.length > 1 && (
            <div className='flex gap-2 overflow-x-auto'>
              {ad.images.map((image, index) => (
                <button
                  key={image + index}
                  type='button'
                  onClick={() => scrollToImage(index)}
                  className={cn(
                    'relative size-16 flex-shrink-0 overflow-hidden rounded-lg border border-transparent bg-gray-100',
                    index === activeImage && 'border-primary'
                  )}
                >
                  <Image
                    src={image}
                    alt={`${ad.title} — фото ${index + 1}`}
                    className='object-cover'
                    fill
                    sizes='64px'
                  />
                </button>
              ))}
            </div>
          )}
        </div>
        <div>
          <div className='relative mb-4 flex items-start justify-between gap-2'>
            <p className='text-2xl font-bold'>
              <span className={cn(isPriceHighlighted && AD_PRICE_HIGHLIGHT_CLASS)}>
                {ad.price ? `${ad.price.toLocaleString('ru-RU')} ₽` : 'Цена договорная'}
              </span>
              {ad.price && ad.unit && PRICE_UNITS[ad.unit] && (
                <span className='block text-sm font-normal text-gray-500'>за {PRICE_UNITS[ad.unit].toLowerCase()}</span>
              )}
            </p>
            <FavoriteButton
              onClick={onClickFavorite}
              isFavorite={!!ad.isFavorite}
              isLoading={isAddingFavorite || isRemovingFavorite}
            />
          </div>

          <div className='mb-8'>
            {isOwner ? (
              <Button
                className='w-full'
                variant='secondary'
                size='lg'
                onClick={() => router.push(`/ads/${ad.id}/edit`)}
              >
                Редактировать объявление
              </Button>
            ) : (
              <div className='flex gap-1.5'>
                <Button
                  variant='default'
                  size='lg'
                  className='grow px-8'
                  onClick={() => setIsPhoneRevealed(true)}
                  nativeButton={!isPhoneRevealed}
                  render={isPhoneRevealed ? <a href={`tel:+${ad.phone}`} /> : undefined}
                >
                  {isPhoneRevealed ? formatPhoneNumber(ad.phone) : 'Показать телефон'}
                </Button>
                <Button
                  size='lg'
                  variant='secondary'
                  className='px-8'
                  nativeButton={false}
                  render={<Link href={`/profile/settings/messages?ad=${ad.id}`} />}
                >
                  Написать
                </Button>
              </div>
            )}
          </div>

          <div className='mb-4 flex items-center gap-3'>
            <UserAvatar user={ad.user!} className='size-12' />
            <div>
              <div className='flex items-center gap-1.5'>
                <p className='text-sm font-medium'>{ad.user?.displayName ?? 'Пользователь'}</p>
              </div>
              {publishedDate && <p className='text-xs text-gray-500'>Опубликовано {publishedDate}</p>}
              {!!ad.user?.adsCount && (
                <p className='text-xs text-gray-500'>
                  Ещё {ad.user.adsCount} {pluralizeRu(ad.user.adsCount, ['объявление', 'объявления', 'объявлений'])}{' '}
                  продавца
                </p>
              )}
            </div>
          </div>
          <div className='mb-6 flex gap-2'>
            {ad.user?.type && (
              <span className='rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-600'>
                {USER_TYPE_LABELS[ad.user.type]}
              </span>
            )}
            {isSellerPremium && (
              <span className='flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-xs text-amber-700'>
                <Crown size={11} />
                Премиум
              </span>
            )}
          </div>
          {!isOwner && user && <ReportAdDialog adId={ad.id} />}
        </div>
      </div>

      <div className='flex flex-col gap-8'>
        <div>
          <Heading level={4} className='mb-2'>
            Адрес
          </Heading>
          <address className='flex gap-2 not-italic'>
            <MapPin className='size-5 flex-shrink-0 translate-y-0.5' />
            {ad.address}
          </address>
        </div>

        {ad.description && (
          <div>
            <Heading level={4} className='mb-2'>
              Описание
            </Heading>
            <p className='leading-6 whitespace-pre-wrap'>{ad.description}</p>
          </div>
        )}

        {filledFeatures.length > 0 && (
          <div>
            <Heading level={4} className='mb-3'>
              Характеристики
            </Heading>
            <dl className='grid grid-cols-1 gap-x-6 gap-y-2'>
              {filledFeatures.map(({ feature, value }) => (
                <div key={feature.id} className='flex gap-2'>
                  <dt className='text-gray-600'>{feature.label}</dt>:<dd className='text-right font-medium'>{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}
      </div>

      {ad.images.length > 0 && (
        <Lightbox
          open={isLightboxOpen}
          close={closeLightbox}
          index={activeImage}
          slides={slides}
          on={{ view: ({ index }) => setActiveImage(index) }}
          animation={{ swipe: 0 }}
          styles={{ slide: { maxWidth: 1280, margin: '0 auto' } }}
        />
      )}
    </div>
  )
}
