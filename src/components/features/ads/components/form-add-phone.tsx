'use client'

import { useAppModal } from '@/store'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'

import {
  Button,
  Field,
  FieldError,
  Input,
  Loading,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui'

import { formatPhoneNumber } from '@/shared/utils'

import { cn } from '@/lib/utils'

import { AuthFormWrapper } from '../../auth/components'
import { IUserPhone } from '../../auth/types'
import { useAddPhoneMutation } from '../../user/hooks'
import { AddPhoneSchema, PhoneCodeSchema, TypeAddPhoneSchema, TypePhoneCodeSchema } from '../schemes'

interface FormAddPhoneProps {
  onSuccessComplete?: (phone: string) => void
  phones?: IUserPhone[]
  mode?: 'ad' | 'profile'
}

export const FormAddPhone = ({ onSuccessComplete, phones = [], mode = 'ad' }: FormAddPhoneProps) => {
  const { onClose } = useAppModal()

  const isProfileMode = mode === 'profile'
  const hasExistingPhones = phones.length > 0

  const [step, setStep] = useState(hasExistingPhones ? 0 : 1)
  const [phone, setPhone] = useState('')

  const [selectedPhone, setSelectedPhone] = useState<string | null>(
    phones.find(p => p.isPrimary)?.phone ?? phones[0]?.phone ?? null
  )

  const { requestPhone, confirmPhone, isRequesting, isConfirming, setPrimaryPhone, isSettingPrimary } =
    useAddPhoneMutation()

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

  const onUseExistingPhone = () => {
    if (!selectedPhone) return

    if (isProfileMode) {
      setPrimaryPhone(selectedPhone, {
        onSuccess: () => {
          onSuccessComplete?.(selectedPhone)
          onClose()
        }
      })
      return
    }

    onSuccessComplete?.(selectedPhone)
    onClose()
  }

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
    confirmPhone(
      { code: data.code, makePrimary: isProfileMode },
      {
        onSuccess: () => {
          onSuccessComplete?.(phone)

          formPhone.reset()
          formCode.reset()

          onClose()
        }
      }
    )
  }

  const heading = isProfileMode ? 'Изменить номер' : step === 0 ? 'Номер для связи' : 'Добавление номера'
  const description =
    step === 0
      ? 'Выберите один из привязанных номеров или укажите новый'
      : step === 1
        ? 'Укажите номер телефона для связи'
        : 'Введите код подтверждения из СМС'

  const isBusy = isRequesting || isConfirming || isSettingPrimary

  return (
    <AuthFormWrapper
      className='mx-auto w-full max-w-md'
      heading={heading}
      isShowSocial={false}
      description={description}
    >
      {step === 0 && (
        <div className='flex flex-col gap-4'>
          <Select value={selectedPhone} onValueChange={setSelectedPhone}>
            <SelectTrigger className='h-13! w-full px-4'>
              <SelectValue placeholder='Выберите номер' />
            </SelectTrigger>
            <SelectContent alignItemWithTrigger={false} align='start'>
              {phones.map(p => (
                <SelectItem key={p.id} value={p.phone} className='rounded-none px-4'>
                  {formatPhoneNumber(p.phone)}
                  {p.isPrimary ? ' (основной)' : ''}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            variant='secondary'
            size='lg'
            type='button'
            className='w-full'
            disabled={!selectedPhone || isBusy}
            onClick={onUseExistingPhone}
          >
            {isProfileMode ? 'Сделать основным' : 'Использовать этот номер'}
          </Button>

          <button
            type='button'
            className='text-muted-foreground self-center text-sm underline'
            onClick={() => setStep(1)}
          >
            Указать другой номер
          </button>
        </div>
      )}

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

          <div className='mt-6 flex gap-3'>
            {hasExistingPhones && (
              <Button variant='outline' size='lg' type='button' onClick={() => setStep(0)} disabled={isRequesting}>
                Назад
              </Button>
            )}

            <Button variant='secondary' size='lg' type='submit' className='flex-1' disabled={isRequesting}>
              {isRequesting ? 'Отправка...' : 'Получить код'}
            </Button>
          </div>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={formCode.handleSubmit(onCodeSubmit)}>
          <Controller
            name='code'
            control={formCode.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className={cn(fieldState.invalid && 'pb-5', 'group')}>
                <Input {...field} maxLength={6} placeholder='Код из СМС' />

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

      {isBusy && <Loading />}
    </AuthFormWrapper>
  )
}
