'use client'

import { useAuthModal } from '@/store'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'
import ReCAPTCHA from 'react-google-recaptcha'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { Button, Field, FieldError, FieldGroup, Input, InputGroup } from '@/components/ui'

import { cn } from '@/lib/utils'

import { AuthWrapper } from './auth-wrapper'
import { useLoginMutation } from './hooks'
import { LoginSchema, TypeLoginSchema } from './schemes'

interface LoginFormProps {
  isShowSocial?: boolean
}

export const LoginForm = ({ isShowSocial = true }: LoginFormProps) => {
  const [recaptchaValue, setRecaptchaValue] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [isShowTwoFactor, setIsShowTwoFactor] = useState(false)
  const { onOpen, onClose } = useAuthModal()

  const form = useForm<TypeLoginSchema>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: '',
      code: ''
    }
  })

  const { login, isLoadingLogin } = useLoginMutation(setIsShowTwoFactor)

  const onSubmit = (values: TypeLoginSchema) => {
    if (recaptchaValue) {
      if (isShowTwoFactor && (!values.code || values.code.trim() === '')) {
        form.setError('code', {
          type: 'manual',
          message: 'Введите код подтверждения'
        })
        return
      }

      login(
        {
          values,
          recaptcha: recaptchaValue
        },
        {
          onSuccess: data => {
            if (!data?.message) {
              onClose()
              form.reset()
            }
          }
        }
      )
    } else {
      toast.error('Пожалуйста, завершите проверку')
    }
  }

  return (
    <AuthWrapper
      heading='Войти'
      description={isShowSocial ? 'Войти с помощью:' : ''}
      switchButtonLabel={
        !isShowTwoFactor && (
          <>
            Еще нет аккаунта? <span className='text-primary'>Зарегистрироваться</span>
          </>
        )
      }
      isShowSocial={isShowSocial && !isShowTwoFactor}
      onSwitchButtonClick={() => onOpen('register')}
    >
      <form id='form-rhf-demo' onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup className={cn('group', !isShowTwoFactor && 'hidden')}>
          <Controller
            name='code'
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className='group'>
                <Input {...field} placeholder='Код' disabled={isLoadingLogin} value={field.value || ''} />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </FieldGroup>
        <FieldGroup className={cn('group', isShowTwoFactor && 'hidden')}>
          <Controller
            name='email'
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className='group'>
                <Input {...field} type='email' placeholder='Почта' disabled={isLoadingLogin} />
                {fieldState.invalid && (
                  <FieldError
                    errors={[fieldState.error]}
                    {...form.register('email')}
                    onInput={e => {
                      const value = (e.target as HTMLInputElement).value
                      form.setValue('email', value, { shouldValidate: true })
                    }}
                  />
                )}
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
                <Button
                  variant='link'
                  className='hover:text-primary inline-block h-auto text-right text-xs text-gray-900 underline'
                  onClick={() => onOpen('new-password')}
                >
                  Забыли пароль?
                </Button>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </FieldGroup>
        <div className='mt-4 flex justify-center'>
          <ReCAPTCHA sitekey={process.env.GOOGLE_RECAPTCHA_SITE_KEY as string} onChange={setRecaptchaValue} />
        </div>
        <Button variant='secondary' size='lg' type='submit' className='mt-8 w-full' disabled={isLoadingLogin}>
          Войти в аккаунт
        </Button>
      </form>
    </AuthWrapper>
  )
}
