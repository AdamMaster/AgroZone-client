'use client'

import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

import { toastMessageHandler } from '@/shared/utils'

import { TypeRegisterSchema } from '../schemes'
import { authService } from '../services'

export function useRegisterMutation() {
  const { mutate: register, isPending: isLoadingRegister } = useMutation({
    mutationKey: ['register user'],

    mutationFn: ({ values, recaptcha }: { values: TypeRegisterSchema; recaptcha: string }) =>
      authService.register(values, recaptcha),

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onSuccess(data: any) {
      toast.success(data.message || 'Регистрация прошла успешно!')
    },

    onError(error) {
      toastMessageHandler(error)
    }
  })

  return { register, isLoadingRegister }
}
