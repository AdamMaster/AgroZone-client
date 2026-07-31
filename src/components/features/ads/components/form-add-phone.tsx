'use client'

import { useAppModal } from '@/store'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'

import { Button, Field, FieldError, Input, Loading } from '@/components/ui'

import { formatPhoneNumber } from '@/shared/utils'

import { cn } from '@/lib/utils'

import { AuthFormWrapper } from '../../auth/components'
import { useAddPhoneMutation } from '../../user/hooks'
import { AddPhoneSchema, PhoneCodeSchema, TypeAddPhoneSchema, TypePhoneCodeSchema } from '../schemes'

interface FormAddPhoneProps {
  onSuccessComplete?: (phone: string) => void
}

export const FormAddPhone = ({ onSuccessComplete }: FormAddPhoneProps) => {
  const { onClose } = useAppModal()

  const [step, setStep] = useState(1)
  const [phone, setPhone] = useState('')

  const { requestPhone, confirmPhone, isRequesting, isConfirming } = useAddPhoneMutation()

  const formPhone = useForm<TypeAddPhoneSchema>({
    resolver: zodResolver(AddPhoneSchema),
    defaultValues: {
      phone: ''
    }
  })

  const formCode = useForm<TypePhoneCodeSchema>({
    resolver: zodResolver(PhoneCodeSchema),
    defaultValues: {
      code: ''
    }
  })

  const onPhoneSubmit = (data: TypeAddPhoneSchema) => {
    const cleanPhone = data.phone.replace(/\D/g, '')

    requestPhone(cleanPhone, {
      onSuccess: () => {
        setPhone(cleanPhone)
        setStep(2)
      }
    })
  }

  const onCodeSubmit = (data: TypePhoneCodeSchema) => {
    confirmPhone(data.code, {
      onSuccess: () => {
        onSuccessComplete?.(phone)

        formPhone.reset()
        formCode.reset()

        onClose()
      }
    })
  }

  return (
    <AuthFormWrapper
      className='mx-auto w-full max-w-md'
      heading='Добавление номера'
      isShowSocial={false}
      description={step === 1 ? 'Укажите номер телефона для связи' : 'Введите код подтверждения из СМС'}
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
                    onChange(formatPhoneNumber(e.target.value))
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
                <Input {...field} maxLength={4} placeholder='Код из СМС' />

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
