'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { toastMessageHandler } from '@/shared/utils'

import { adsService } from '../services/ads.service'
import { IAd } from '../types/ad.types'

export function useToggleFavorite() {
  const queryClient = useQueryClient()

  const { mutate: toggleFavorite, isPending: isLoadingToggle } = useMutation({
    mutationKey: ['toggle favorite'],

    mutationFn: (id: string) => adsService.toggleFavorite(id),

    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: ['ads'] })

      const previousQueries = queryClient.getQueriesData<IAd[]>({ queryKey: ['ads'] })

      previousQueries.forEach(([queryKey]) => {
        queryClient.setQueryData<IAd[]>(queryKey, old => {
          if (!old) return old
          return old.map(ad => (ad.id === id ? { ...ad, isFavorite: !ad.isFavorite } : ad))
        })
      })

      return { previousQueries }
    },

    onError: (_err, _id, context) => {
      if (context?.previousQueries) {
        context.previousQueries.forEach(([queryKey, previousData]) => {
          queryClient.setQueryData(queryKey, previousData)
        })
      }
      toast.error('Ошибка при обновлении избранного')
    },

    onSuccess(data) {
      toast.success(data.isFavorite ? 'Добавлено в избранное' : 'Удалено из избранного')

      // Инвалидируем все запросы, начинающиеся с 'ads' и 'favorite-ads'
      queryClient.invalidateQueries({ queryKey: ['ads'] })
      queryClient.invalidateQueries({ queryKey: ['favorite-ads'] })
    }
  })

  return { toggleFavorite, isLoadingToggle }
}
