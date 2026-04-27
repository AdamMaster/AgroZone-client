'use client'

import { useAuthModal } from '@/store'
import { Controller } from 'react-hook-form'

import {
  Button,
  Field,
  FieldButton,
  FieldDescription,
  FieldGroup,
  Heading,
  Input,
  Label,
  Skeleton,
  Switch
} from '@/components/ui'

import { useProfile } from '@/shared/hooks'

import { cn } from '@/lib/utils'

import { useTwoFactorMutation } from '../hooks/use-two-factor-mutation'

export const ContentSecurity = () => {
  const { user, isLoading } = useProfile()
  const { onOpen, onClose, setView } = useAuthModal()
  const { toggle2fa, isToggleLoading } = useTwoFactorMutation()

  return (
    <div className=''>
      <div className='relative flex flex-col gap-8'>
        <div>
          <Heading level={5} className='mb-4'>
            Пароль
          </Heading>
          {isLoading ? (
            <Skeleton className='rounded-1 h-10 w-full' />
          ) : (
            <Field>
              <div className='relative'>
                <Input readOnly placeholder={user?.password ? '••••••' : 'Пароль не установлен'}></Input>
                <FieldButton onClick={() => onOpen('change-password')}>
                  {user?.password ? 'Сменить пароль' : 'Установить пароль'}
                </FieldButton>
              </div>
            </Field>
          )}
        </div>
        <div>
          <Heading level={5} className='mb-4'>
            Двух-факторная аутентификация
          </Heading>
          {isLoading ? (
            <Skeleton className='rounded-1 h-17 w-full' />
          ) : (
            <Field className='group mt-4 rounded-md border bg-gray-50 px-4 py-4'>
              <div className='flex items-center justify-between'>
                <div className='space-y-0.5'>
                  <Label>Двухфакторная аутентификация</Label>
                  <FieldDescription>
                    Включите двухфакторную аутентификацию, чтобы защитить свой аккаунт
                  </FieldDescription>
                </div>
                <Switch
                  checked={user?.isTwoFactorEnabled ?? false}
                  onCheckedChange={() => toggle2fa()}
                  disabled={isToggleLoading || isLoading}
                />
              </div>
            </Field>
          )}
        </div>
      </div>
    </div>
  )
}
