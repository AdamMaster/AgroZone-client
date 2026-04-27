import { create } from 'zustand'

interface AuthModalStore {
  isOpen: boolean
  view:
    | 'login'
    | 'login-after-reset'
    | 'register'
    | 'new-password'
    | 'code-message'
    | 'change-email'
    | 'change-email-message'
    | 'register-message'
    | 'change-password'
    | 'change-password-confirm'
  onOpen: (
    view?:
      | 'login'
      | 'login-after-reset'
      | 'register'
      | 'new-password'
      | 'code-message'
      | 'change-email'
      | 'change-email-message'
      | 'register-message'
      | 'change-password'
      | 'change-password-confirm'
  ) => void
  onClose: () => void
  setView: (
    view:
      | 'login'
      | 'login-after-reset'
      | 'register'
      | 'new-password'
      | 'code-message'
      | 'change-email'
      | 'change-email-message'
      | 'register-message'
      | 'change-password'
      | 'change-password-confirm'
  ) => void
}

export const useAuthModal = create<AuthModalStore>(set => ({
  isOpen: false,
  view: 'login',
  onOpen: (view = 'login') => set({ isOpen: true, view }),
  onClose: () => set({ isOpen: false }),
  setView: view => set({ view })
}))
