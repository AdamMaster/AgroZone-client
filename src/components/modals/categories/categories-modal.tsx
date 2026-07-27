'use client'

import { useCategoriesModal } from '@/store'

import { CategoryList } from '@/components/features/categories/components'
import { Dialog, DialogContent } from '@/components/ui/dialog'

export const CategoriesModal = () => {
  const { isOpen, onClose } = useCategoriesModal()

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='max-h-[calc(100%_-_40px)] w-[calc(100%_-_40px)] max-w-280 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent overflow-hidden overflow-y-auto rounded-3xl border-none p-10'>
        <CategoryList />
      </DialogContent>
    </Dialog>
  )
}
