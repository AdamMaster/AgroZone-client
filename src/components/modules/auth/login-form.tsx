import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff } from 'lucide-react'
import React, { useState } from 'react'
import ReCAPTCHA from 'react-google-recaptcha'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { Button, Field, FieldError, FieldGroup, Input, InputGroup } from '@/components/ui'

import { AuthWrapper } from './auth-wrapper'
import { useLoginMutation } from './hooks'
import { LoginSchema, TypeLoginSchema } from './schemes'

interface LoginFormProps {
  onRegisterClick: () => void
}

export const LoginForm = ({ onRegisterClick }: LoginFormProps) => {
  const [recaptchaValue, setRecaptchaValue] = useState<string | null>(null)

  const form = useForm<TypeLoginSchema>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  const { login, isLoadingLogin } = useLoginMutation()

  const onSubmit = (values: TypeLoginSchema) => {
    if (recaptchaValue) {
      login({ values, recaptcha: recaptchaValue })
    } else {
      toast.error('Пожалуйста, завершите проверку')
    }
  }

  const [showPassword, setShowPassword] = React.useState(false)

  return (
    <AuthWrapper
      heading='Войти'
      description='Войти с помощью:'
      switchButtonLabel={
        <>
          Еще нет аккаунта? <span className='text-primary'>Зарегистрироваться</span>
        </>
      }
      isShowSocial
      onSwitchButtonClick={onRegisterClick}
    >
      <form id='form-rhf-demo' onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup>
          <Controller
            name='email'
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className='group'>
                <Input {...field} type='email' placeholder='Почта' disabled={isLoadingLogin} />
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
                    disabled={isLoadingLogin}
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
        </FieldGroup>
        <div className='mt-4 flex justify-center'>
          <ReCAPTCHA sitekey={process.env.GOOGLE_RECAPTCHA_SITE_KEY as string} onChange={setRecaptchaValue} />
        </div>
        <Button variant='secondary' size='lg' type='submit' className='mt-8' disabled={isLoadingLogin}>
          Войти в аккаунт
        </Button>
      </form>
    </AuthWrapper>
  )
}
