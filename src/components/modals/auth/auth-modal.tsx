'use client'

import { useAuthModal } from '@/store'

import { Dialog, DialogContent } from '@/components/ui/dialog'

import { AuthMessage, LoginForm, RegisterForm, ResetPasswordForm } from '../../features'

export const AuthModal = () => {
  const { isOpen, view, onClose } = useAuthModal()

  const renderContent = () => {
    switch (view) {
      case 'login':
        return <LoginForm />
      case 'login-after-reset':
        return <LoginForm isShowSocial={false} />
      case 'register':
        return <RegisterForm />
      case 'new-password':
        return <ResetPasswordForm />
      case 'code-message':
        return <AuthMessage heading='Проверьте почту' text='На вашу почту была отправлена ссылка для подтверждения.' />
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='max-w-105 border-none p-8'>{renderContent()}</DialogContent>
    </Dialog>
  )
}
