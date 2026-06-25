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
  slug: string
  parentId: string | null
  children?: ICategory[]
  availableFeatures?: IAvailableFeature[]
}
