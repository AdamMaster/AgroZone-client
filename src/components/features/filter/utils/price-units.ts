import { ICategory } from '../../categories/types'

// Единицы цены, которыми реально пользуются товары в этой категории и во
// всех её подкатегориях — объединение priceUnits всех листьев поддерева.
// У родительских категорий собственное поле priceUnits почти всегда
// дефолтное (['ITEM']), т.к. реальные единицы заданы только на листьях
// (см. server/prisma/data/categories.ts, inferPriceUnits) — поэтому для
// фильтра цены его нельзя использовать напрямую, нужно смотреть на детей.
export const getEffectivePriceUnits = (category: ICategory): string[] => {
  if (!category.children?.length) {
    return category.priceUnits?.length ? category.priceUnits : ['ITEM']
  }

  const units = new Set<string>()

  for (const child of category.children) {
    getEffectivePriceUnits(child).forEach(unit => units.add(unit))
  }

  return units.size ? Array.from(units) : ['ITEM']
}
