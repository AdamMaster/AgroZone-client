'use client'

import { useAppModal } from '@/store'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { Button, Field, FieldError, Input, Loading } from '@/components/ui'

import { formatPhoneNumber } from '@/shared/utils'

import { cn } from '@/lib/utils'

import { AuthFormWrapper } from '../../auth/components'
import { usePhoneChangeMutation } from '../hooks'
import { ChangePhoneCodeSchema, ChangePhoneSchema, TypeChangePhoneCodeSchema, TypeChangePhoneSchema } from '../schemes'

export const FormPhoneChange = ({ onSuccessComplete }: { onSuccessComplete?: () => void }) => {
  const [step, setStep] = useState(1)
  const [phoneData, setPhoneData] = useState({ phone: '' })
  const { setView, onClose } = useAppModal()

  const { requestPhone, isRequesting, confirmPhone, isConfirming } = usePhoneChangeMutation()

  const formPhone = useForm<TypeChangePhoneSchema>({
    resolver: zodResolver(ChangePhoneSchema),
    defaultValues: { phone: '' }
  })

  const formCode = useForm<TypeChangePhoneCodeSchema>({
    resolver: zodResolver(ChangePhoneCodeSchema),
    defaultValues: { code: '' }
  })

  const onPhoneSubmit = (data: TypeChangePhoneSchema) => {
    const cleanPhone = data.phone.replace(/\D/g, '')

    requestPhone(cleanPhone, {
      onSuccess: () => {
        setPhoneData({ phone: cleanPhone })
        setStep(2)
      }
    })
  }

  const onCodeSubmit = (data: TypeChangePhoneCodeSchema) => {
    confirmPhone(data.code, {
      onSuccess: () => {
        formPhone.reset()
        formCode.reset()
        if (onSuccessComplete) onSuccessComplete()

        onClose()
      }
    })
  }

  return (
    <AuthFormWrapper
      className='mx-auto w-full max-w-md'
      heading='Смена номера'
      isShowSocial={false}
      description={
        step === 1
          ? 'Введите новый номер телефона для подтверждения'
          : 'Введите 4-значный код, отправленный на новый номер'
      }
    >
      {step === 1 && (
        <form onSubmit={formPhone.handleSubmit(onPhoneSubmit)}>
          <Controller
            name='phone'
            control={formPhone.control}
            render={({ field: { onChange, value, ...field }, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className={cn(fieldState.invalid && 'pb-5', 'group')}>
                <Input
                  {...field}
                  value={value}
                  type='tel'
                  placeholder='+7 (999) 999-99-99'
                  maxLength={18}
                  onChange={e => {
                    const formatted = formatPhoneNumber(e.target.value)
                    onChange(formatted)
                  }}
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <Button variant='secondary' size='lg' type='submit' className='mt-6 w-full' disabled={isRequesting}>
            {isRequesting ? 'Отправка...' : 'Получить код'}
          </Button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={formCode.handleSubmit(onCodeSubmit)}>
          <Controller
            name='code'
            control={formCode.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className={cn(fieldState.invalid && 'pb-5', 'group')}>
                <Input {...field} placeholder='Код из СМС' maxLength={6} />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <div className='mt-6 flex gap-3'>
            <Button variant='outline' size='lg' type='button' onClick={() => setStep(1)} disabled={isConfirming}>
              Назад
            </Button>
            <Button variant='secondary' size='lg' type='submit' className='flex-1' disabled={isConfirming}>
              {isConfirming ? 'Проверка...' : 'Подтвердить'}
            </Button>
          </div>
        </form>
      )}

      {(isRequesting || isConfirming) && <Loading />}
    </AuthFormWrapper>
  )
}
