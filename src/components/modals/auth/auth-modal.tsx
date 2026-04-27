'use client'

import { useAuthModal } from '@/store'

import { StatusMessage } from '@/components/ui'
import { Dialog, DialogContent } from '@/components/ui/dialog'

import { FormEmailChange, FormLogin, FormPasswordChange, FormRegister, FormResetPassword } from '../../features'

export const AuthModal = () => {
  const { isOpen, view, onClose } = useAuthModal()

  const renderContent = () => {
    switch (view) {
      case 'login':
        return <FormLogin />
      case 'login-after-reset':
        return <FormLogin isShowSocial={false} />
      case 'register':
        return <FormRegister />
      case 'new-password':
        return <FormResetPassword />
      case 'change-password':
        return <FormPasswordChange />
      case 'change-email':
        return <FormEmailChange />
      case 'code-message':
        return (
          <StatusMessage heading='Проверьте почту' text='На вашу почту была отправлена ссылка для подтверждения.' />
        )
      case 'change-email-message':
        return <StatusMessage heading='Запрос отправлен' text='Проверьте новую почту для подтверждения изменений.' />
      case 'register-message':
        return (
          <StatusMessage
            heading='Регистрация прошла успешно!'
            text='Пожалуйста, подтвердите ваш email. Сообщение было отправлено на ваш почтовый адрес.'
          />
        )
      case 'change-password-confirm':
        return <StatusMessage heading='Пароль обновлен!' text='Ваши данные успешно сохранены.' />
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='max-w-105 overflow-hidden border-none p-8'>{renderContent()}</DialogContent>
    </Dialog>
  )
}
