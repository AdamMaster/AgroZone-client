'use client'

import { useAuthModal } from '@/store'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import ReCAPTCHA from 'react-google-recaptcha'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { Button, Field, FieldError, FieldGroup, Input, Loading } from '@/components/ui'

import { cn } from '@/lib/utils'

import { useResetPasswordMutation } from '../hooks'
import { ResetPasswordSchema, TypeResetPasswordSchema } from '../schemes'
import { AuthFormWrapper } from './auth-form-wrapper'

export const FormResetPassword = () => {
  const [recaptchaValue, setRecaptchaValue] = useState<string | null>(null)
  const { onOpen, setView } = useAuthModal()

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
            setView('code-message')
          }
        }
      )
    } else {
      toast.error('Пожалуйста, завершите проверку')
    }
  }

  return (
    <AuthFormWrapper
      heading='Сброс пароля'
      description='Введите вашу почту, и мы отправим на неё ссылку для восстановления пароля'
      switchButtonLabel={<>Войти в аккаунт</>}
      onSwitchButtonClick={() => onOpen('login')}
      isShowSocial={false}
    >
      <form id='form-rhf-demo' onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup>
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
        </FieldGroup>
        <div className='mt-6 flex justify-center'>
          <ReCAPTCHA sitekey={process.env.GOOGLE_RECAPTCHA_SITE_KEY as string} onChange={setRecaptchaValue} />
        </div>
        <Button variant='secondary' size='lg' type='submit' className='mt-10 w-full'>
          Сбросить
        </Button>
      </form>
      {isLoadingReset && <Loading />}
    </AuthFormWrapper>
  )
}
