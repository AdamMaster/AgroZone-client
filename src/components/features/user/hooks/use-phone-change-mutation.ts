import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { userServices } from '../services'

export function usePhoneChangeMutation() {
  const queryClient = useQueryClient()

  const { mutate: requestPhone, isPending: isRequesting } = useMutation({
    mutationFn: (newPhone: string) => userServices.requestPhoneChange(newPhone),
    onSuccess: () => {
      toast.success('Код подтверждения отправлен на новый номер')
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      if (error.statusCode === 429) {
        toast.error('Слишком много запросов. Пожалуйста, подождите минуту.')
        return
      }

      const message = error.message || 'Ошибка при запросе кода'
      toast.error(message)
    }
  })

  const { mutate: confirmPhone, isPending: isConfirming } = useMutation({
    mutationFn: (code: string) => userServices.confirmPhoneChange(code),
    onSuccess: () => {
      toast.success('Номер телефона успешно изменен')
      queryClient.invalidateQueries({ queryKey: ['profile'] })
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
