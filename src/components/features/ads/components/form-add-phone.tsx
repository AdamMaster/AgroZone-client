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

import { IUserPhone } from '../../auth/types'
import { AuthFormWrapper } from '../../auth/components'
import { useAddPhoneMutation } from '../../user/hooks'
import { AddPhoneSchema, PhoneCodeSchema, TypeAddPhoneSchema, TypePhoneCodeSchema } from '../schemes'

interface FormAddPhoneProps {
  onSuccessComplete?: (phone: string) => void
  // Уже привязанные к аккаунту номера. Если они есть — сначала предлагаем
  // выбрать один из них, а не сразу вести пользователя через ввод номера
  // и SMS-код (этот номер уже подтверждён, повторно подтверждать не нужно).
  phones?: IUserPhone[]
}

export const FormAddPhone = ({ onSuccessComplete, phones = [] }: FormAddPhoneProps) => {
  const { onClose } = useAppModal()

  const hasExistingPhones = phones.length > 0

  // step 0 — выбор из уже привязанных номеров (только если они есть)
  // step 1 — ввод нового номера
  // step 2 — код подтверждения из SMS
  const [step, setStep] = useState(hasExistingPhones ? 0 : 1)
  const [phone, setPhone] = useState('')

  const [selectedPhone, setSelectedPhone] = useState<string | null>(
    phones.find(p => p.isPrimary)?.phone ?? phones[0]?.phone ?? null
  )

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

  const onUseExistingPhone = () => {
    if (!selectedPhone) return

    // Уже подтверждённый номер — просто отдаём его наверх и закрываем
    // модалку, без единого запроса к серверу. Основным он не становится:
    // мы вообще не трогаем его статус, только используем для объявления.
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
    confirmPhone(data.code, {
      onSuccess: () => {
        onSuccessComplete?.(phone)

        formPhone.reset()
        formCode.reset()

        onClose()
      }
    })
  }

  const heading = step === 0 ? 'Номер для связи' : 'Добавление номера'
  const description =
    step === 0
      ? 'Выберите один из привязанных номеров или укажите новый'
      : step === 1
        ? 'Укажите номер телефона для связи'
        : 'Введите код подтверждения из СМС'

  return (
    <AuthFormWrapper className='mx-auto w-full max-w-md' heading={heading} isShowSocial={false} description={description}>
      {step === 0 && (
        <div className='flex flex-col gap-4'>
          <Select value={selectedPhone} onValueChange={setSelectedPhone}>
            <SelectTrigger className='h-13! w-full px-4'>
              {/* Select.Value по умолчанию показывает "сырое" value выбранного
                  Item (у нас это чистые цифры номера из базы), а не его
                  отформатированный текст (children) — из-за этого после
                  выбора номера в триггере отображались нечитаемые цифры
                  вместо "+7 (999) 999-99-99". Явно форматируем значение. */}
              <SelectValue placeholder='Выберите номер'>
                {(value: string | null) => {
                  if (!value) return null

                  const phone = phones.find(p => p.phone === value)

                  return `${formatPhoneNumber(value)}${phone?.isPrimary ? ' (основной)' : ''}`
                }}
              </SelectValue>
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
            disabled={!selectedPhone}
            onClick={onUseExistingPhone}
          >
            Использовать этот номер
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
