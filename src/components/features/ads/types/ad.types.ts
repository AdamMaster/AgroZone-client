export interface IAvailableFeature {
  name: string
  label: string
  type: 'select' | 'text' | 'number' | 'boolean'
  required: boolean
  options?: string[]
}

export interface ICategory {
  id: string
  name: string
  parentId: string | null
  children?: ICategory[]
  availableFeatures?: IAvailableFeature[]
}

export interface IAd {
  id: string
  title: string
  description: string
  price: number | null
  unit?: string
  address: string
  images: string[]
  status: 'DRAFT' | 'PENDING' | 'PUBLISHED' | 'REJECTED' | 'ARCHIVED' | 'EXPIRED'
  expiresAt: Date | null
  publishedAt: Date | null
  lat: number
  lng: number
  features: IAvailableFeature
  createdAt: Date
  updatedAt: Date
  userId: string
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
