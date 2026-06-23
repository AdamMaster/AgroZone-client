import { ICategory } from './types/categories.types'

interface CategoryItemProps {
  category: ICategory
}

export const CategoryItem = ({ category }: CategoryItemProps) => {
  return (
    <button className='rounded-lg bg-gray-100 px-2.5 py-2 text-sm transition-colors hover:bg-gray-200'>
      {category.name}
    </button>
  )
}
