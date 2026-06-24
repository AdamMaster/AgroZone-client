'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { toast } from 'sonner'

import { toastMessageHandler } from '@/shared/utils'

import { adsService } from '../services/ads.service'
import { IAd } from '../types/ad.types'

// Импортируем интерфейс объявления

export function useSaveDraft() {
  const queryClient = useQueryClient()

  const [draftId, setDraftId] = useState<string | undefined>(undefined)

  const { mutate: saveDraft, isPending: isLoadingSaveDraft } = useMutation({
    mutationKey: ['save draft ad'],
    mutationFn: (data: FormData) => adsService.saveDraft(data, draftId) as Promise<IAd>,
    onSuccess(response) {
      toast.success('Черновик успешно сохранен!')

      if (response?.id && !draftId) {
        setDraftId(response.id)
      }

      queryClient.invalidateQueries({ queryKey: ['my-ads'] })
    },
    onError(error) {
      toastMessageHandler(error)
    }
  })

  return {
    saveDraft,
    isLoadingSaveDraft,
    draftId
  }
}
