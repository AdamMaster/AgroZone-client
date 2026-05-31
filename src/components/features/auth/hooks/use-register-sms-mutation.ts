'use client'

import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

import { toastMessageHandler } from '@/shared/utils'

// Импортируем типы для всех шагов СМС-регистрации
import { TypeRegisterSmsFinalSchema, TypeRegisterSmsPhoneSchema } from '../schemes'
import { authService } from '../services'

export function useRegisterSmsMutation() {
  // 1. Мутация для первого шага (отправка телефона и получение СМС)
  const { mutate: registerSmsStart, isPending: isLoadingSmsStart } = useMutation({
    mutationKey: ['register sms start'],

    mutationFn: ({ values, recaptcha }: { values: TypeRegisterSmsPhoneSchema; recaptcha: string }) =>
      authService.registerSmsStart(values, recaptcha),

    onError(error) {
      toastMessageHandler(error)
    }
  })

  // 2. Мутация для финального шага (отправка всех данных и создание юзера)
  const { mutate: registerSmsFinal, isPending: isLoadingSmsFinal } = useMutation({
    mutationKey: ['register sms final'],

    // Собираем в аргументы финальные данные формы и сохраненные телефон с кодом
    mutationFn: (data: TypeRegisterSmsFinalSchema & { phone: string; code: string }) =>
      authService.registerSmsComplete(data),

    onSuccess() {
      toast.success('Регистрация успешно завершена!')
    },

    onError(error) {
      toastMessageHandler(error)
    }
  })

  return {
    registerSmsStart,
    isLoadingSmsStart,
    registerSmsFinal,
    isLoadingSmsFinal
  }
}
