'use client'

import { useAuthModal } from '@/store'

import { Dialog, DialogContent } from '@/components/ui/dialog'

import { LoginForm, NewPasswordForm, RegisterForm, ResetPasswordForm } from '../../features'

export const AuthModal = () => {
  const { isOpen, view, onClose, setView } = useAuthModal()

  const renderContent = () => {
    switch (view) {
      case 'login':
        return <LoginForm />
      case 'register':
        return <RegisterForm />
      case 'new-password':
        return <ResetPasswordForm />
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='max-w-105 border-none p-8'>{renderContent()}</DialogContent>
    </Dialog>
  )
}
