import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { toastMessageHandler } from '@/shared/utils'

import { userServices } from '../services'

export function useVerifyBusinessMutation() {
  const queryClient = useQueryClient()

  const { mutate: verifyBusiness, isPending: isLoadingVerifyBusiness } = useMutation({
    mutationKey: ['verify business'],
    mutationFn: (inn: string) => userServices.verifyBusiness(inn),
    onSuccess() {
      toast.success('Организация подтверждена')
      queryClient.invalidateQueries({ queryKey: ['profile'] })
    },
    onError(error) {
      toastMessageHandler(error)
    }
  })

  return { verifyBusiness, isLoadingVerifyBusiness }
}
