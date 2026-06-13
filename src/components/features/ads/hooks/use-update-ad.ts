'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { toastMessageHandler } from '@/shared/utils'

import { adsService } from '../services'

export function useUpdateAd(id: string) {
  const queryClient = useQueryClient()
  const router = useRouter()

  const { mutate: updateAd, isPending: isLoadingUpdate } = useMutation({
    mutationKey: ['update ad', id],
    mutationFn: (data: FormData) => adsService.update(id, data),
    onSuccess() {
      toast.success('Объявление успешно обновлено!')
      queryClient.invalidateQueries({ queryKey: ['my-ads'] })
      queryClient.invalidateQueries({ queryKey: ['ad', id] })
      router.push('/profile/settings/ads')
    },
    onError(error) {
      toastMessageHandler(error)
    }
  })

  return { updateAd, isLoadingUpdate }
}
