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
