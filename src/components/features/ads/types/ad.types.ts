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
  address: string
  status: 'DRAFT' | 'PENDING' | 'PUBLISHED' | 'REJECTED' | 'ARCHIVED'
  images: string[]
  createdAt: Date
  updatedAt: Date
  userId: string
  categoryId: string
  category?: {
    id: string
    name: string
  }
  rejectionReason?: string
}
