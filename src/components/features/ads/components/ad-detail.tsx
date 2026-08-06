'use client'

import { ImageIcon, MapPin, Phone } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useRef, useState } from 'react'
import Lightbox from 'yet-another-react-lightbox'
import Zoom from 'yet-another-react-lightbox/plugins/zoom'

import 'yet-another-react-lightbox/styles.css'

import { Avatar, AvatarFallback, AvatarImage, Button, ButtonBack, Heading } from '@/components/ui'

import { PRICE_UNITS } from '@/shared/constants/units'
import { USER_TYPE_LABELS } from '@/shared/constants/user-types'
import { useProfile } from '@/shared/hooks'
import { formatPhoneNumber, pluralizeRu } from '@/shared/utils'

import { cn } from '@/lib/utils'

import { useAd, useAddFavorite, useRemoveFavorite } from '../hooks'
import { IAd, ICategoryFeature } from '../types/ad.types'
import { BumpStatusHandler } from './bump-status-handler'
import { CategoryBreadcrumbItem, CategoryBreadcrumbs } from './category-breadcrumbs'
import { FavoriteButton } from './favorite-button'
import { ReportAdDialog } from './report-ad-dialog'

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

  // Свайп по самим фото — обычный горизонтальный скролл со scroll-snap,
  // без единой JS-библиотеки: нативная инерция браузера/тачпада на
  // мобильных ничем не хуже (а часто и лучше) любой карусельной либы.
  // JS-библиотека (yarl) нужна только там, где CSS реально бессилен — для
  // зума в полноэкранном режиме.
  const scrollToImage = (index: number) => {
    const slide = galleryRef.current?.children[index] as HTMLElement | undefined
    slide?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
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

  // yarl сравнивает slides по ссылке: если пересоздавать массив на каждый
  // рендер (а рендер триггерится в том числе самим on.view при свайпе),
  // лайтбокс считает, что слайды "изменились", и сбрасывает текущий кадр
  // обратно на index — свайп визуально не даёт пролистать дальше текущего
  // фото. useMemo держит ссылку стабильной, пока не поменялись сами фото.
  const slides = useMemo(() => ad.images.map(src => ({ src })), [ad.images])

  const closeLightbox = () => {
    setIsLightboxOpen(false)
    // Досинхронизировать фоновую scroll-snap галерею с тем, на каком фото
    // остановились внутри лайтбокса — делаем это один раз при закрытии, а
    // не на каждый шаг свайпа, чтобы не гонять лишний scrollIntoView.
    scrollToImage(activeImage)
  }

  return (
    <div className='relative mt-6 max-w-[950px]'>
      <BumpStatusHandler adId={ad.id} />
      <div className='absolute top-0 -left-18 h-full'>
        <ButtonBack onClick={() => router.back()} />
      </div>
      <CategoryBreadcrumbs className='mb-2' items={[{ name: 'Каталог', href: '/catalog' }, ...categoryPath]} />

      <Heading level={1} className='mb-6'>
        {ad.title}
      </Heading>

      <div className='mb-8 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_360px]'>
        <div>
          {ad.images.length > 0 ? (
            <div
              ref={galleryRef}
              className='mb-2 flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain rounded-xl bg-gray-100 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'
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
                    'relative size-16 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100',
                    index === activeImage && 'ring-primary ring-2'
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
              {ad.price ? `${ad.price.toLocaleString('ru-RU')} ₽` : 'Цена договорная'}
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
                  // Пока телефон скрыт, это обычная <button> (клик просто
                  // раскрывает номер), а после раскрытия render подменяет её
                  // на <a href='tel:...'>, чтобы можно было сразу позвонить —
                  // то есть реальный рендерящийся элемент меняется вместе с
                  // isPhoneRevealed, и nativeButton должен меняться синхронно
                  // с ним (не статичное true/false), иначе Base UI ругается
                  // в консоль в одном из двух состояний.
                  nativeButton={!isPhoneRevealed}
                  render={isPhoneRevealed ? <a href={`tel:+${ad.phone}`} /> : undefined}
                >
                  {isPhoneRevealed ? formatPhoneNumber(ad.phone) : 'Показать телефон'}
                </Button>
                {/* /profile/settings/messages защищена middleware'ом — незалогиненного
                    просто отправит на /?auth=true, отдельно проверять авторизацию тут
                    не нужно (та же логика, что уже работает для остальных /profile
                    страниц). */}
                <Button
                  size='lg'
                  variant='secondary'
                  className='px-8'
                  // Эта кнопка ВСЕГДА рендерится как <Link> (= <a>), никогда
                  // как настоящий <button> — в отличие от кнопки телефона
                  // выше, тут нет условия. nativeButton по умолчанию true —
                  // отсюда то же предупреждение Base UI, только теперь на
                  // этой кнопке, и оно всегда актуально, а не только в одном
                  // из состояний.
                  nativeButton={false}
                  render={<Link href={`/profile/settings/messages?ad=${ad.id}`} />}
                >
                  Написать
                </Button>
              </div>
            )}
          </div>

          <div className='mb-6 flex items-center gap-3'>
            <Avatar size='lg'>
              <AvatarImage src={ad.user?.picture ?? undefined} />
              <AvatarFallback>{ad.user?.displayName?.[0]?.toUpperCase() ?? '?'}</AvatarFallback>
            </Avatar>
            <div>
              <div className='flex items-center gap-1.5'>
                <p className='text-sm font-medium'>{ad.user?.displayName ?? 'Пользователь'}</p>
                {/* Частное лицо / ИП / Компания — чисто информационная метка,
                    без привязанных к ней привилегий на площадке. */}
                {ad.user?.type && (
                  <span className='rounded-full bg-gray-100 px-2 py-0.5 text-[11px] text-gray-600'>
                    {USER_TYPE_LABELS[ad.user.type]}
                  </span>
                )}
              </div>
              {publishedDate && <p className='text-xs text-gray-500'>Опубликовано {publishedDate}</p>}
              {/* Ссылки нет: страницы всех объявлений продавца в проекте
                  пока не существует — как появится, обернуть в Link. */}
              {!!ad.user?.adsCount && (
                <p className='text-xs text-gray-500'>
                  Ещё {ad.user.adsCount} {pluralizeRu(ad.user.adsCount, ['объявление', 'объявления', 'объявлений'])} продавца
                </p>
              )}
            </div>
          </div>
          <address className='mb-4 flex items-center gap-2 not-italic'>
            <MapPin className='size-5 flex-shrink-0' />
            {ad.address}
          </address>

          {/* Только для чужих объявлений и только для авторизованных — в
              отличие от "Написать" (это переход на защищённый middleware'ом
              маршрут), тут прямое действие на этой же странице, поэтому
              незалогиненного просто не показываем, а не полагаемся на
              редирект. */}
          {!isOwner && user && <ReportAdDialog adId={ad.id} />}
        </div>
      </div>

      {ad.description && (
        <div className='mb-8'>
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

      {ad.images.length > 0 && (
        <Lightbox
          open={isLightboxOpen}
          close={closeLightbox}
          index={activeImage}
          slides={slides}
          plugins={[Zoom]}
          on={{ view: ({ index }) => setActiveImage(index) }}
          // Ограничиваем шириной именно область самого фото (slide), а не
          // весь лайтбокс — фон/контейнер остаются на всю ширину экрана,
          // просто на широких мониторах фото не растягивается до огромных
          // размеров. Внутренний <img> уже скейлится через object-fit
          // относительно slide, так что этого достаточно.
          styles={{ slide: { maxWidth: 1280, margin: '0 auto' } }}
        />
      )}
    </div>
  )
}
