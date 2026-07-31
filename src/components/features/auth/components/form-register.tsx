'use client'

import { useAppModal } from '@/store'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff } from 'lucide-react'
import React, { useState } from 'react'
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { Button, Field, FieldError, FieldGroup, Input, InputGroup, Loading } from '@/components/ui'

import { cn } from '@/lib/utils'

import { useRegisterMutation } from '../hooks'
import { RegisterSchema, TypeRegisterSchema } from '../schemes'
import { AuthFormWrapper } from './auth-form-wrapper'

export const FormRegister = () => {
  const { onOpen, setView } = useAppModal()

  const { executeRecaptcha } = useGoogleReCaptcha()

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

  const onSubmit = async (values: TypeRegisterSchema) => {
    if (!executeRecaptcha) {
      toast.error('Капча еще не загрузилась, попробуйте снова')
      return
    }

    try {
      const recaptchaToken = await executeRecaptcha('register')

      register(
        { values, recaptcha: recaptchaToken },
        {
          onSuccess: () => {
            form.reset()
            setView('register-message')
          }
        }
      )
    } catch (error) {
      toast.error('Ошибка проверки безопасности')
    }
  }

  const [showPassword, setShowPassword] = React.useState(false)
  const [showPasswordRepeat, setShowPasswordRepeat] = React.useState(false)

  return (
    <AuthFormWrapper
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
              <Field data-invalid={fieldState.invalid} className={cn(fieldState.invalid && 'pb-5', 'group')}>
                <Input {...field} type='name' placeholder='Имя' />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <Controller
            name='email'
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className={cn(fieldState.invalid && 'pb-5', 'group')}>
                <Input {...field} type='email' placeholder='Почта' />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <Controller
            name='password'
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className={cn(fieldState.invalid && 'pb-5', 'group')}>
                <InputGroup>
                  <Input {...field} type={showPassword ? 'text' : 'password'} placeholder='Пароль' />
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
              <Field data-invalid={fieldState.invalid} className={cn(fieldState.invalid && 'pb-5', 'group')}>
                <InputGroup>
                  <Input {...field} type={showPasswordRepeat ? 'text' : 'password'} placeholder='Повторите пароль' />
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
        <div className='mt-4 flex justify-center'></div>
        <Button variant='secondary' size='lg' type='submit' className='mt-8 w-full'>
          Создать аккаунт
        </Button>
        {isLoadingRegister && <Loading />}
      </form>
    </AuthFormWrapper>
  )
}
