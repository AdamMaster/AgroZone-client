import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { userServices } from '../services'

export function useAddPhoneMutation() {
  const queryClient = useQueryClient()

  const { mutate: requestPhone, isPending: isRequesting } = useMutation({
    mutationFn: (phone: string) => userServices.requestAddPhone(phone),

    onSuccess: () => {
      toast.success('Код подтверждения отправлен')
    },

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      const message = error.message || 'Ошибка при отправке кода'

      toast.error(message)
    }
  })

  const { mutate: confirmPhone, isPending: isConfirming } = useMutation({
    mutationFn: (code: string) => userServices.confirmAddPhone(code),

    onSuccess: () => {
      toast.success('Номер телефона добавлен')

      queryClient.invalidateQueries({
        queryKey: ['profile']
      })
    },

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Неверный код подтверждения'

      toast.error(message)
    }
  })

  return {
    requestPhone,
    isRequesting,
    confirmPhone,
    isConfirming
  }
}
