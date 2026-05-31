import { create } from 'zustand'

interface AuthModalStore {
  isOpen: boolean
  view:
    | 'register'
    | 'register-sms'
    | 'login'
    | 'login-after-reset'
    | 'new-password'
    | 'code-message'
    | 'change-email'
    | 'change-email-message'
    | 'register-message'
    | 'change-password'
    | 'change-password-confirm'
  onOpen: (
    view?:
      | 'register'
      | 'register-sms'
      | 'login'
      | 'login-after-reset'
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
      | 'register'
      | 'register-sms'
      | 'login'
      | 'login-after-reset'
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
