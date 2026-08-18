'use client'

import { useAppModal } from '@/store'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'

import {
  Button,
  Checkbox,
  Field,
  FieldError,
  FieldGroup,
  Input,
  InputGroup,
  Loading,
  PasswordToggle
} from '@/components/ui'

import { formatPhoneNumber } from '@/shared/utils'

import { cn } from '@/lib/utils'

import { useRegisterSmsMutation } from '../hooks/use-register-sms-mutation'
import {
  RegisterSmsCodeSchema,
  RegisterSmsFinalSchema,
  RegisterSmsPhoneSchema,
  TypeRegisterSmsCodeSchema,
  TypeRegisterSmsFinalSchema,
  TypeRegisterSmsPhoneSchema
} from '../schemes'
import { AuthFormWrapper } from './auth-form-wrapper'

export const FormRegisterSms = () => {
  const { setView, onOpen, onClose } = useAppModal()
  const [step, setStep] = useState(1)
  const [regData, setRegData] = useState({ phone: '', code: '' })
  const [showPassword, setShowPassword] = useState(false)
  const {
    registerSmsStart,
    isLoadingSmsStart,
    registerSmsFinal,
    isLoadingSmsFinal,
    verifyRegisterCode,
    isLoadingCode
  } = useRegisterSmsMutation()
  const router = useRouter()

  const { executeRecaptcha } = useGoogleReCaptcha()

  const formPhone = useForm<TypeRegisterSmsPhoneSchema>({
    resolver: zodResolver(RegisterSmsPhoneSchema),
    defaultValues: { phone: '' }
  })

  const formCode = useForm<TypeRegisterSmsCodeSchema>({
    resolver: zodResolver(RegisterSmsCodeSchema),
    defaultValues: { code: '' }
  })

  const formFinal = useForm<TypeRegisterSmsFinalSchema>({
    resolver: zodResolver(RegisterSmsFinalSchema),
    defaultValues: { name: '', password: '', passwordRepeat: '', personalDataConsent: false }
  })

  const onFormPhoneSubmit = async (data: TypeRegisterSmsPhoneSchema) => {
    if (!executeRecaptcha) {
      toast.error('Капча еще не загрузилась, попробуйте снова')
      return
    }

    try {
      const recaptchaToken = await executeRecaptcha('register_sms_start')

      // Очищаем номер: "+7 (930) 408-79-71" -> "79304087971"
      const cleanPhone = data.phone.replace(/\D/g, '')
      const cleanedData = { phone: cleanPhone }

      registerSmsStart(
        { values: cleanedData, recaptcha: recaptchaToken },
        {
          onSuccess: () => {
            // Сохраняем в стейт именно очищенный телефон
            setRegData(prev => ({ ...prev, ...cleanedData }))
            toast.success('Код успешно отправлен!')
            setStep(2)
          }
        }
      )
    } catch (error) {
      toast.error('Ошибка проверки безопасности')
    }
  }

  const onFormCodeSubmit = (data: TypeRegisterSmsCodeSchema) => {
    const phone = regData.phone

    verifyRegisterCode(
      { phone, code: data.code },
      {
        onSuccess: () => {
          setRegData(prev => ({ ...prev, ...data }))
          setStep(3)
        }
      }
    )
  }

  const onFormFinalSubmit = (data: TypeRegisterSmsFinalSchema) => {
    const fullData = { ...regData, ...data }

    registerSmsFinal(fullData, {
      onSuccess: () => {
        formPhone.reset()
        formCode.reset()
        formFinal.reset()

        setView('register-sms-message')

        setTimeout(() => {
          onClose()
        }, 2500)
      }
    })
  }

  return (
    <AuthFormWrapper
      heading='Регистрация'
      isShowSocial={false}
      description={step === 1 ? 'Введите номер телефона' : step === 2 ? 'Введите код из звонка' : 'Придумайте пароль'}
      switchButtonLabel={
        <>
          Уже есть аккаунт? <span className='text-primary'>Войти</span>
        </>
      }
      onSwitchButtonClick={() => onOpen('login')}
    >
      {step === 1 && (
        <form id='form-rhf-demo' onSubmit={formPhone.handleSubmit(onFormPhoneSubmit)}>
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
          <Button variant='secondary' size='lg' type='submit' className='mt-8 w-full'>
            Продолжить
          </Button>
        </form>
      )}
      {step === 2 && (
        <form id='form-rhf-demo' onSubmit={formCode.handleSubmit(onFormCodeSubmit)}>
          <Controller
            name='code'
            control={formCode.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className={cn(fieldState.invalid && 'pb-5', 'group')}>
                <Input {...field} placeholder='Последние 4 цифры номера' maxLength={4} />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <Button variant='secondary' size='lg' type='submit' className='mt-8 w-full'>
            Продолжить
          </Button>
        </form>
      )}
      {step === 3 && (
        <form id='form-rhf-demo' onSubmit={formFinal.handleSubmit(onFormFinalSubmit)}>
          <FieldGroup>
            <Controller
              name='name'
              control={formFinal.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className={cn(fieldState.invalid && 'pb-5', 'group')}>
                  <Input {...field} placeholder='Ваше имя' />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              name='password'
              control={formFinal.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className={cn(fieldState.invalid && 'pb-5', 'group')}>
                  <InputGroup>
                    <Input {...field} type={showPassword ? 'text' : 'password'} placeholder='Пароль' />
                    <PasswordToggle isShow={showPassword} onClick={() => setShowPassword(!showPassword)} />
                  </InputGroup>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              name='passwordRepeat'
              control={formFinal.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className={cn(fieldState.invalid && 'pb-5', 'group')}>
                  <InputGroup>
                    <Input {...field} type={showPassword ? 'text' : 'password'} placeholder='Повторите пароль' />
                    <PasswordToggle isShow={showPassword} onClick={() => setShowPassword(!showPassword)} />
                  </InputGroup>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </FieldGroup>
          <Controller
            name='personalDataConsent'
            control={formFinal.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className='mt-4'>
                <label className='flex items-start gap-2 text-left'>
                  <Checkbox
                    checked={!!field.value}
                    onCheckedChange={field.onChange}
                    className='mt-0.5 size-4 shrink-0'
                  />
                  <span className='text-sm text-gray-500'>
                    Я даю согласие на{' '}
                    <Link href='/privacy' target='_blank' className='text-primary underline'>
                      обработку персональных данных
                    </Link>{' '}
                    в соответствии с политикой конфиденциальности
                  </span>
                </label>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <Button variant='secondary' size='lg' type='submit' className='mt-8 w-full'>
            Завершить регистрацию
          </Button>
          {isLoadingSmsFinal && <Loading />}
        </form>
      )}
    </AuthFormWrapper>
  )
}
