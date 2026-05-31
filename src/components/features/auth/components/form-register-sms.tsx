'use client'

import { useAuthModal } from '@/store'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff } from 'lucide-react'
import React, { useState } from 'react'
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { Button, Field, FieldError, FieldGroup, Input, InputGroup, Loading, PasswordToggle } from '@/components/ui'

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
  const { setView, onOpen } = useAuthModal()
  const [step, setStep] = useState(1)
  const [regData, setRegData] = useState({ phone: '', code: '' })
  const [showPassword, setShowPassword] = useState(false)
  const { registerSmsStart, isLoadingSmsStart, registerSmsFinal, isLoadingSmsFinal } = useRegisterSmsMutation()

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
    defaultValues: { name: '', password: '', passwordRepeat: '' }
  })

  const onFormPhoneSubmit = async (data: TypeRegisterSmsPhoneSchema) => {
    if (!executeRecaptcha) {
      toast.error('Капча еще не загрузилась, попробуйте снова')
      return
    }

    try {
      const recaptchaToken = await executeRecaptcha('register_sms_start')

      registerSmsStart(
        { values: data, recaptcha: recaptchaToken },
        {
          onSuccess: () => {
            setRegData(prev => ({ ...prev, ...data }))
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
    setRegData(prev => ({ ...prev, ...data }))
    setStep(3)
  }

  const onFormFinalSubmit = (data: TypeRegisterSmsFinalSchema) => {
    const fullData = { ...regData, ...data }

    registerSmsFinal(fullData, {
      onSuccess: () => {
        formPhone.reset()
        formCode.reset()
        formFinal.reset()
        onOpen('login')
      }
    })
  }

  return (
    <AuthFormWrapper
      heading='Регистрация'
      isShowSocial={false}
      description={step === 1 ? 'Введите номер телефона' : step === 2 ? 'Введите код из СМС' : 'Придумайте пароль'}
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
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className={cn(fieldState.invalid && 'pb-5', 'group')}>
                <Input {...field} type='tel' placeholder='Номер телефона' />
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
                <Input {...field} placeholder='Код из СМС (4 цифры)' maxLength={4} />
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
          <Button variant='secondary' size='lg' type='submit' className='mt-8 w-full'>
            Завершить регистрацию
          </Button>
          {isLoadingSmsFinal && <Loading />}
        </form>
      )}
    </AuthFormWrapper>
  )
}
