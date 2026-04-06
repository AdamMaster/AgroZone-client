import { create } from 'zustand'

interface AuthModalStore {
  isOpen: boolean
  view: 'login' | 'login-after-reset' | 'register' | 'new-password' | 'code-message'
  onOpen: (view?: 'login' | 'login-after-reset' | 'register' | 'new-password' | 'code-message') => void
  onClose: () => void
  setView: (view: 'login' | 'login-after-reset' | 'register' | 'new-password' | 'code-message') => void
}

export const useAuthModal = create<AuthModalStore>(set => ({
  isOpen: false,
  view: 'login',
  onOpen: (view = 'login') => set({ isOpen: true, view }),
  onClose: () => set({ isOpen: false }),
  setView: view => set({ view })
}))
