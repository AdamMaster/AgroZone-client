'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { toastMessageHandler } from '@/shared/utils'

import { adsService } from '../services'

export function usePublishAd() {
  const queryClient = useQueryClient()

  const { mutate: publishAd, isPending: isLoadingPublish } = useMutation({
    mutationKey: ['publish ad'],
    mutationFn: (id: string) => adsService.publish(id),

    onSuccess() {
      toast.success('Объявление опубликовано')

      queryClient.invalidateQueries({
        queryKey: ['pending-ads']
      })

      queryClient.invalidateQueries({
        queryKey: ['published-ads']
      })
    },

    onError(error) {
      toastMessageHandler(error)
    }
  })

  return {
    publishAd,
    isLoadingPublish
  }
}
