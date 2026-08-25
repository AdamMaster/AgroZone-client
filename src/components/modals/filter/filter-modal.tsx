'use client'

import { useFilterModal } from '@/store'

import { useCategories } from '@/components/features/categories/hooks/use-categories'
import { Filter } from '@/components/features/filter/components'
import { Heading, ScrollArea } from '@/components/ui'
import { Dialog, DialogContent } from '@/components/ui/dialog'

// Открывается кнопкой фильтра в SearchBar (видна только до md, см.
// search-bar.tsx) — переиспользует тот же <Filter>, что и сайдбар каталога
// на десктопе, просто во весь экран. Кнопка-триггер существует только
// ниже md, поэтому адаптивная стилизация под десктоп здесь не нужна — окно
// физически не может открыться на широком экране.
export const FilterModal = () => {
  const { isOpen, onClose } = useFilterModal()
  const { categories } = useCategories()

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='top-0 right-0 bottom-0 left-0 flex max-w-none translate-x-0 translate-y-0 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent flex-col gap-0 overflow-hidden overflow-y-auto rounded-none border-none p-4'>
        <Heading level={2} className='mb-6 pr-10 text-xl font-bold'>
          Фильтры
        </Heading>

        <ScrollArea className='h-full'>
          <Filter categories={categories} />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
