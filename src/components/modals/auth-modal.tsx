'use client'

import { useAuthModal } from '@/store'

import { Dialog, DialogContent } from '@/components/ui/dialog'

import { LoginForm, RegisterForm } from '../modules'

export const AuthModal = () => {
  const { isOpen, view, onClose, setView } = useAuthModal()

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='max-w-105 border-none p-8'>
        {view === 'login' ? (
          <LoginForm onRegisterClick={() => setView('register')} />
        ) : (
          <RegisterForm onLoginClick={() => setView('login')} />
        )}
      </DialogContent>
    </Dialog>
  )
}
