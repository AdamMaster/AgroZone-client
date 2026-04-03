'use client'

import { useAuthModal } from '@/store'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'
import ReCAPTCHA from 'react-google-recaptcha'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { Button, Field, FieldError, FieldGroup, Input, InputGroup } from '@/components/ui'

import { AuthWrapper } from './auth-wrapper'
import { useNewPasswordMutation } from './hooks'
import { NewPasswordSchema, TypeNewPasswordSchema } from './schemes'

export const NewPasswordForm = () => {
  const [recaptchaValue, setRecaptchaValue] = useState<string | null>(null)

  const form = useForm<TypeNewPasswordSchema>({
    resolver: zodResolver(NewPasswordSchema),
    defaultValues: {
      password: ''
    }
  })

  const { newPassword, isLoadNewPassword } = useNewPasswordMutation()

  const onSubmit = (values: TypeNewPasswordSchema) => {
    if (recaptchaValue) {
      newPassword({ values, recaptcha: recaptchaValue })
    } else {
      toast.error('Пожалуйста, завершите проверку')
    }
  }

  const { onOpen } = useAuthModal()

  const [showPassword, setShowPassword] = useState(false)

  return (
    <AuthWrapper
      heading='Новый пароль'
      description='Придумайте новый пароль для вашего аккаунта'
      className='max-w-105 rounded-xl border bg-white p-8'
    >
      <form id='form-rhf-demo' onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup>
          <Controller
            name='password'
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className='group'>
                <InputGroup>
                  <Input
                    {...field}
                    type={showPassword ? 'text' : 'password'}
                    placeholder='Новый пароль'
                    disabled={isLoadNewPassword}
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
        <div className='mt-6 flex justify-center'>
          <ReCAPTCHA sitekey={process.env.GOOGLE_RECAPTCHA_SITE_KEY as string} onChange={setRecaptchaValue} />
        </div>
        <Button variant='secondary' size='lg' type='submit' className='mt-10 w-full' disabled={isLoadNewPassword}>
          Продолжить
        </Button>
      </form>
      <button className='mt-8 block w-full text-center hover:opacity-80' onClick={() => onOpen('login')}>
        Войти в аккаунт
      </button>
    </AuthWrapper>
  )
}
