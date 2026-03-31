import { useState } from 'react'

import { Dialog, DialogContent } from '@/components/ui/dialog'

import { LoginForm, RegisterForm } from '../modules'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
}

export const AuthModal = ({ isOpen, onClose }: AuthModalProps) => {
  const [view, setView] = useState<'login' | 'register'>('login')

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
