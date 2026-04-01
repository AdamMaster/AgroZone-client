import { create } from 'zustand'

interface AuthModalStore {
  isOpen: boolean
  view: 'login' | 'register'
  onOpen: (view?: 'login' | 'register') => void
  onClose: () => void
  setView: (view: 'login' | 'register') => void
}

export const useAuthModal = create<AuthModalStore>(set => ({
  isOpen: false,
  view: 'login',
  onOpen: (view = 'login') => set({ isOpen: true, view }),
  onClose: () => set({ isOpen: false }),
  setView: view => set({ view })
}))
