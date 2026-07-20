import { ICategory, ICategoryFeature } from '@/components/features/ads/types/ad.types'

export interface IFlatCategory {
  id: string
  name: string
  path: string[]
  categoryFeatures: ICategoryFeature[]
}

export const flattenCategories = (cats: ICategory[], parentPath: string[] = []): IFlatCategory[] => {
  return cats.flatMap((cat): IFlatCategory[] => {
    const currentPath = [...parentPath, cat.name]

    const current: IFlatCategory = {
      id: cat.id,
      name: cat.name,
      path: currentPath,
      categoryFeatures: cat.categoryFeatures || []
    }

    const children = cat.children ? flattenCategories(cat.children, currentPath) : []

    return [current, ...children]
  })
}

export const getPathToCategory = (categories: ICategory[], targetId: string): string[] => {
  for (const cat of categories) {
    if (cat.id === targetId) return [cat.id]
    if (cat.children) {
      const path = getPathToCategory(cat.children, targetId)
      if (path.length > 0) return [cat.id, ...path]
    }
  }
  return []
}

export const findCategoryById = (cats: ICategory[], id: string): ICategory | null => {
  for (const cat of cats) {
    if (cat.id === id) return cat
    if (cat.children) {
      const found = findCategoryById(cat.children, id)
      if (found) return found
    }
  }
  return null
}
