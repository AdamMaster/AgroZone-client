import { useAdStore } from '@/store'
import { ChevronRight } from 'lucide-react'

export const CategoryBreadcrumbs = () => {
  const { categoryPath } = useAdStore()

  return (
    <div className='mt-2 flex items-center text-sm text-gray-500'>
      {categoryPath.map((item, index) => (
        <div key={index} className='flex items-center gap-0.5'>
          <span>{item}</span>
          {index < categoryPath.length - 1 && <ChevronRight size={14} />}
        </div>
      ))}
    </div>
  )
}
