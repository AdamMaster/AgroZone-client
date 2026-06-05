'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { toastMessageHandler } from '@/shared/utils'

import { TypeRegisterSmsFinalSchema, TypeRegisterSmsPhoneSchema } from '../schemes'
import { authService } from '../services'

export function useRegisterSmsMutation() {
  const queryClient = useQueryClient()

  const { mutate: registerSmsStart, isPending: isLoadingSmsStart } = useMutation({
    mutationKey: ['register sms start'],
    mutationFn: ({ values, recaptcha }: { values: TypeRegisterSmsPhoneSchema; recaptcha: string }) =>
      authService.registerSmsStart(values, recaptcha),
    onError(error) {
      toastMessageHandler(error)
    }
  })

  const { mutate: verifyRegisterCode, isPending: isLoadingCode } = useMutation({
    mutationKey: ['register check code'],
    mutationFn: (data: { phone: string; code: string }) => authService.checkRegisterCode(data),
    onError(error) {
      toastMessageHandler(error)
    }
  })

  const { mutate: registerSmsFinal, isPending: isLoadingSmsFinal } = useMutation({
    mutationKey: ['register sms final'],
    mutationFn: (data: TypeRegisterSmsFinalSchema & { phone: string; code: string }) =>
      authService.registerSmsComplete(data),

    onSuccess() {
      toast.success('Регистрация успешно завершена!')
      queryClient.invalidateQueries({ queryKey: ['profile'] })
    },
    onError(error) {
      toastMessageHandler(error)
    }
  })

  return {
    registerSmsStart,
    isLoadingSmsStart,
    verifyRegisterCode,
    isLoadingCode,
    registerSmsFinal,
    isLoadingSmsFinal
  }
}
