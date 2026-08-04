'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { adsService } from '../services/ads.service'
import { IAdsListResponse } from '../types/ad.types'

export function useRemoveFavorite() {
  const queryClient = useQueryClient()

  const { mutate: removeFavorite, isPending: isRemovingFavorite } = useMutation({
    mutationKey: ['remove favorite'],

    mutationFn: (id: string) => adsService.removeFavorite(id),

    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: ['ads'] })

      // Кэш под ['ads', params] — это IAdsListResponse, не голый массив
      // (см. use-toggle-favorite.ts) — тут была та же причина, по которой
      // не работало удаление из избранного.
      const previousQueries = queryClient.getQueriesData<IAdsListResponse>({
        queryKey: ['ads']
      })

      previousQueries.forEach(([queryKey]) => {
        queryClient.setQueryData<IAdsListResponse>(queryKey, old => {
          if (!old) return old

          return { ...old, items: old.items.map(ad => (ad.id === id ? { ...ad, isFavorite: false } : ad)) }
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

      toast.error('Не удалось удалить из избранного')
    },

    onSuccess: () => {
      toast.success('Удалено из избранного')

      queryClient.invalidateQueries({ queryKey: ['ads'] })
      queryClient.invalidateQueries({ queryKey: ['favorite-ads'] })
    }
  })

  return { removeFavorite, isRemovingFavorite }
}
