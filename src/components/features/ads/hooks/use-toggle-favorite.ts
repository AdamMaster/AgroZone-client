'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { toastMessageHandler } from '@/shared/utils'

import { adsService } from '../services/ads.service'
import { IAdsListResponse } from '../types/ad.types'

export function useToggleFavorite() {
  const queryClient = useQueryClient()

  const { mutate: toggleFavorite, isPending: isLoadingToggle } = useMutation({
    mutationKey: ['toggle favorite'],

    mutationFn: (id: string) => adsService.toggleFavorite(id),

    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: ['ads'] })

      // Кэш под ключом ['ads', params] — это IAdsListResponse
      // ({items, total, page, limit}), а не голый массив (с тех пор, как
      // useAds стал отдавать total для пагинации фильтра) — раньше здесь
      // ошибочно предполагался IAd[], из-за чего old.map падал с
      // TypeError ещё до реального запроса на сервер, и избранное
      // переставало добавляться/удаляться вообще молча (весь mutate
      // обрывался в onMutate).
      const previousQueries = queryClient.getQueriesData<IAdsListResponse>({ queryKey: ['ads'] })

      previousQueries.forEach(([queryKey]) => {
        queryClient.setQueryData<IAdsListResponse>(queryKey, old => {
          if (!old) return old
          return { ...old, items: old.items.map(ad => (ad.id === id ? { ...ad, isFavorite: !ad.isFavorite } : ad)) }
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
