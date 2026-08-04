export interface ICategoryFeature {
  id: string
  categoryId: string
  name: string
  label: string
  type: 'TEXT' | 'NUMBER' | 'SELECT' | 'BOOLEAN'
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
  priceUnits: string[]
  children?: ICategory[]
  isBack?: boolean
}
