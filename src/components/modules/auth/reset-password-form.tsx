'use client'

import { useAuthModal } from '@/store'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import ReCAPTCHA from 'react-google-recaptcha'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { Button, Field, FieldError, FieldGroup, Input } from '@/components/ui'

import { AuthWrapper } from './auth-wrapper'
import { useResetPasswordMutation } from './hooks'
import { ResetPasswordSchema, TypeResetPasswordSchema } from './schemes'

export const ResetPasswordForm = () => {
  const [recaptchaValue, setRecaptchaValue] = useState<string | null>(null)
  const { onOpen, onClose } = useAuthModal()

  const form = useForm<TypeResetPasswordSchema>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      email: ''
    }
  })

  const { reset, isLoadingReset } = useResetPasswordMutation()

  const onSubmit = (values: TypeResetPasswordSchema) => {
    if (recaptchaValue) {
      reset(
        { values, recaptcha: recaptchaValue },
        {
          onSuccess: () => {
            form.reset()
            onClose()
          }
        }
      )
    } else {
      toast.error('Пожалуйста, завершите проверку')
    }
  }

  return (
    <AuthWrapper
      heading='Сброс пароля'
      description='Для сброса пароля введите свою почту'
      switchButtonLabel={<>Войти в аккаунт</>}
      onSwitchButtonClick={() => onOpen('login')}
    >
      <form id='form-rhf-demo' onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup>
          <Controller
            name='email'
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className='group'>
                <Input {...field} type='email' placeholder='Почта' disabled={isLoadingReset} />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </FieldGroup>
        <div className='mt-6 flex justify-center'>
          <ReCAPTCHA sitekey={process.env.GOOGLE_RECAPTCHA_SITE_KEY as string} onChange={setRecaptchaValue} />
        </div>
        <Button variant='secondary' size='lg' type='submit' className='mt-10 w-full' disabled={isLoadingReset}>
          Сбросить
        </Button>
      </form>
    </AuthWrapper>
  )
}
