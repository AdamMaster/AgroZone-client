import { UserType } from '../../auth/types'

export interface ICategoryFeature {
  id: string
  categoryId: string
  name: string
  label: string
  type: 'TEXT' | 'NUMBER' | 'SELECT' | 'MULTI_SELECT' | 'BOOLEAN'
  options?: string[]
  // Отдаётся бэкендом (CategoryFeature.filterable), нужно для сайдбара
  // фильтра каталога.
  filterable: boolean
  createdAt: Date
  updatedAt: Date
}

export interface ICategory {
  id: string
  name: string
  slug: string
  code: string
  iconId: string | null
  parentId: string | null
  level: number
  sortOrder: number
  path: string[]
  fullPath: string
  categoryFeatures: ICategoryFeature[]
  priceUnits: string[]
  children?: ICategory[]
}

export interface IAdUser {
  id: string
  phone?: string | null
  displayName: string
  picture?: string | null
  createdAt?: Date
  // Сколько ещё активных (опубликованных, не просроченных) объявлений есть
  // у этого продавца, помимо текущего — отдаётся только в GET /ads/:id
  // (публичная карточка объявления), поэтому опционально: в списках
  // (findAll и т.п.) это поле не приходит.
  adsCount?: number
  // Частное лицо / ИП / компания — по той же причине опционально: приходит
  // только с GET /ads/:id.
  type?: UserType
  // Для бейджа "Премиум" рядом с именем продавца (см. AdDetail) — та же
  // причина опциональности, что и у остальных полей выше. Сырое значение
  // с бэкенда, активность проверяется на фронте через isPremiumActive из
  // '@/shared/utils/user.util'.
  premiumUntil?: string | null
}

export interface IAd {
  id: string
  title: string
  description: string
  price: number | null
  unit?: string
  address: string
  phone: string
  images: string[]
  status: 'DRAFT' | 'PENDING' | 'PUBLISHED' | 'REJECTED' | 'ARCHIVED' | 'EXPIRED'
  expiresAt: Date | null
  publishedAt: Date | null
  lat: number
  lng: number
  region?: string | null
  regionIsoCode?: string | null
  locality?: string | null
  localityFiasId?: string | null
  features: ICategoryFeature
  createdAt: Date
  updatedAt: Date
  userId: string
  user?: IAdUser
  categoryId: string
  category?: {
    id: string
    name: string
    slug?: string
    fullPath?: string
  }
  rejectionReason?: string
  isFavorite?: boolean
  // Когда объявление в последний раз "подняли" (платно или автоматически) —
  // влияет на сортировку каталога (см. ads.service.ts на бэкенде, DATE_DESC:
  // COALESCE(bumped_at, created_at)). Пока активна платная услуга
  // "Поднять объявление" (bumpServiceUntil) или премиум у владельца
  // объявления, этот момент раз в сутки обновляется автоматически — см.
  // AdAutoBumpWorker на бэкенде.
  bumpedAt?: Date | string | null
  // До какого момента активна платная услуга "Поднять объявление" — пока
  // это в будущем, объявление раз в сутки само поднимается в топ (см.
  // AdAutoBumpWorker). Null/дата в прошлом — услуга не куплена/закончилась.
  bumpServiceUntil?: Date | string | null
}

// Значения — строго как в enum AdReportReason на бэкенде (prisma/schema.prisma).
export enum AdReportReason {
  Scam = 'SCAM',
  WrongCategory = 'WRONG_CATEGORY',
  ProhibitedItem = 'PROHIBITED_ITEM',
  Duplicate = 'DUPLICATE',
  Spam = 'SPAM',
  Other = 'OTHER'
}

export interface ICreateAdReportDto {
  reason: AdReportReason
  comment?: string
}

export interface IUpdateAdDto {
  title?: string
  description?: string
  price?: number
  unit?: string
  address?: string
  images?: string[]
  lat?: number
  lng?: number
  features?: Record<string, unknown>
  categoryId?: string
}

// Форма объявления в очереди модерации (GET /ads/pending) — отличается от
// обычного IAd: category и user отдаются полными объектами (не опционально,
// не в укороченном виде), плюс у user есть email/телефон — модератору нужно
// иметь возможность связаться с продавцом, на публичной карточке объявления
// эти поля никогда не отдаются.
export interface IPendingAdUser {
  id: string
  displayName: string | null
  email: string | null
  phones: { phone: string }[]
}

export interface IPendingAdCategory {
  id: string
  name: string
  fullPath: string
}

export interface IPendingAd {
  id: string
  title: string
  price: number | null
  images: string[]
  address: string
  createdAt: string
  category: IPendingAdCategory
  user: IPendingAdUser
}

// Полная карточка объявления для превью модератора (GET /ads/:id/moderation)
// — по сути тот же IAd, но с "владельческим" видом на продавца (email и
// телефон напрямую, как в IPendingAd/IPendingAdUser, а не скрытый номер
// как на публичной странице) и без опциональности статус-зависимых полей.
export type IModerationAd = Omit<IAd, 'user' | 'category'> & {
  user: IPendingAdUser | null
  category: IPendingAdCategory
}

export type AdCardData = Pick<IAd, 'id' | 'title' | 'price' | 'images' | 'address' | 'createdAt' | 'isFavorite'>
export type AdCardListData = Pick<
  IAd,
  'id' | 'title' | 'description' | 'price' | 'images' | 'address' | 'createdAt' | 'isFavorite' | 'user'
>

// Ответ GET /ads — с приходом фильтра каталогу нужен total (количество
// найденных объявлений), поэтому эндпоинт отдаёт не голый массив, а объект.
export interface IAdsListResponse {
  items: IAd[]
  total: number
  page: number
  limit: number
}

// Ответ GET /ads/locations — реальные локации (регионы целиком и
// конкретные города/сёла), где прямо сейчас есть опубликованные
// объявления (см. AdsService.getAvailableLocations на бэкенде), для
// фильтра каталога по местоположению. Один список на два уровня
// специфичности — 'region' (выбор фильтрует весь регион целиком) и
// 'locality' (точечный фильтр по конкретному городу/селу, через
// стабильный ФИАС-id, а не сравнение строк).
// Значения — строго как в enum AdBumpStatus на бэкенде (prisma/schema.prisma).
export type AdBumpStatus = 'PENDING' | 'SUCCEEDED' | 'CANCELED'

export interface IAdBump {
  id: string
  adId: string
  userId: string
  status: AdBumpStatus
  amount: number
  yookassaPaymentId?: string | null
  paidAt?: string | null
  createdAt: string
  updatedAt: string
}

export interface ICreateBumpCheckoutResponse {
  confirmationUrl: string
  bumpId: string
}

export type LocationOptionType = 'region' | 'locality'

export interface ILocationOption {
  type: LocationOptionType
  label: string
  // Регионы и локальности, пришедшие из реальных объявлений, всегда несут
  // ISO-код региона (см. AdsService.getAvailableLocations). У городов из
  // статичного справочника RuCity (доступны для поиска даже без единого
  // объявления) его нет — мы намеренно не хардкодим ISO 3166-2:RU коды.
  regionIsoCode?: string
  localityFiasId?: string
}
