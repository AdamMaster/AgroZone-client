'use client'

import { useAuthModal } from '@/store'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff } from 'lucide-react'
import React, { useState } from 'react'
import ReCAPTCHA from 'react-google-recaptcha'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { Button, Field, FieldError, FieldGroup, Input, InputGroup } from '@/components/ui'

import { AuthWrapper } from './auth-wrapper'
import { useRegisterMutation } from './hooks'
import { RegisterSchema, TypeRegisterSchema } from './schemes'

export const RegisterForm = () => {
  const [recaptchaValue, setRecaptchaValue] = useState<string | null>(null)
  const { onOpen, onClose } = useAuthModal()

  const form = useForm<TypeRegisterSchema>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      passwordRepeat: ''
    }
  })

  const { register, isLoadingRegister } = useRegisterMutation()

  const onSubmit = (values: TypeRegisterSchema) => {
    if (recaptchaValue) {
      register(
        { values, recaptcha: recaptchaValue },
        {
          onSuccess: () => {
            form.reset()
            setRecaptchaValue(null)
            onClose()
          }
        }
      )
    } else {
      toast.error('Пожалуйста, завершите проверку')
    }
  }

  const [showPassword, setShowPassword] = React.useState(false)
  const [showPasswordRepeat, setShowPasswordRepeat] = React.useState(false)

  return (
    <AuthWrapper
      heading='Регистрация'
      description='Выберите удобный способ'
      switchButtonLabel={
        <>
          Уже есть аккаунт? <span className='text-primary'>Войти</span>
        </>
      }
      isShowSocial
      onSwitchButtonClick={() => onOpen('login')}
    >
      <form id='form-rhf-demo' onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup>
          <Controller
            name='name'
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className='group'>
                <Input {...field} type='name' placeholder='Имя' disabled={isLoadingRegister} />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <Controller
            name='email'
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className='group'>
                <Input {...field} type='email' placeholder='Почта' disabled={isLoadingRegister} />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <Controller
            name='password'
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className='group'>
                <InputGroup>
                  <Input
                    {...field}
                    type={showPassword ? 'text' : 'password'}
                    placeholder='Пароль'
                    disabled={isLoadingRegister}
                  />
                  <button
                    type='button'
                    className='absolute top-1/2 right-2.5 h-auto -translate-y-[50%] hover:bg-transparent'
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Скрыть пароль' : 'Показать пароль'}
                  >
                    {showPassword ? (
                      <Eye className='text-muted-foreground h-4 w-4' />
                    ) : (
                      <EyeOff className='text-muted-foreground h-4 w-4' />
                    )}
                  </button>
                </InputGroup>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <Controller
            name='passwordRepeat'
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className='group'>
                <InputGroup>
                  <Input
                    {...field}
                    type={showPasswordRepeat ? 'text' : 'password'}
                    placeholder='Повторите пароль'
                    disabled={isLoadingRegister}
                  />
                  <button
                    type='button'
                    className='absolute top-1/2 right-2.5 h-auto -translate-y-[50%] hover:bg-transparent'
                    onClick={() => setShowPasswordRepeat(!showPasswordRepeat)}
                    aria-label={showPasswordRepeat ? 'Скрыть пароль' : 'Показать пароль'}
                  >
                    {showPasswordRepeat ? (
                      <Eye className='text-muted-foreground h-4 w-4' />
                    ) : (
                      <EyeOff className='text-muted-foreground h-4 w-4' />
                    )}
                  </button>
                </InputGroup>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </FieldGroup>
        <div className='mt-4 flex justify-center'>
          <ReCAPTCHA sitekey={process.env.GOOGLE_RECAPTCHA_SITE_KEY as string} onChange={setRecaptchaValue} />
        </div>
        <Button variant='secondary' size='lg' type='submit' className='mt-8 w-full' disabled={isLoadingRegister}>
          Создать аккаунт
        </Button>
      </form>
    </AuthWrapper>
  )
}
