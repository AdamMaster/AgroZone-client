export interface ICategoryFeature {
  id: string
  categoryId: string
  name: string
  label: string
  type: 'TEXT' | 'NUMBER' | 'SELECT' | 'MULTI_SELECT' | 'BOOLEAN'
  options?: string[]
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
  children?: ICategory[]
}

export interface IAdUser {
  id: string
  phone?: string | null
  displayName: string
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
