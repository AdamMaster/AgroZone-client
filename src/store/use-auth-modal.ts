import { create } from 'zustand'

interface AuthModalStore {
  isOpen: boolean
  view: 'login' | 'register' | 'new-password'
  onOpen: (view?: 'login' | 'register' | 'new-password') => void
  onClose: () => void
  setView: (view: 'login' | 'register' | 'new-password') => void
}

export const useAuthModal = create<AuthModalStore>(set => ({
  isOpen: false,
  view: 'login',
  onOpen: (view = 'login') => set({ isOpen: true, view }),
  onClose: () => set({ isOpen: false }),
  setView: view => set({ view })
}))
