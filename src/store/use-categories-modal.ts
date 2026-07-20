import { create } from 'zustand'

interface CategoriesModalStore {
  isOpen: boolean
  onOpen: () => void
  onClose: () => void
}

export const useCategoriesModal = create<CategoriesModalStore>(set => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false })
}))
