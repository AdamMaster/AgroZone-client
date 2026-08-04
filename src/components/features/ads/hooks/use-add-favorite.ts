'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { adsService } from '../services/ads.service'
import { IAdsListResponse } from '../types/ad.types'

export function useAddFavorite() {
  const queryClient = useQueryClient()

  const { mutate: addFavorite, isPending: isAddingFavorite } = useMutation({
    mutationKey: ['add favorite'],

    mutationFn: (id: string) => adsService.addFavorite(id),

    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: ['ads'] })

      // Кэш под ['ads', params] — это IAdsListResponse, не голый массив
      // (см. use-toggle-favorite.ts) — тут была та же причина, по которой
      // не работало добавление в избранное.
      const previousQueries = queryClient.getQueriesData<IAdsListResponse>({
        queryKey: ['ads']
      })

      previousQueries.forEach(([queryKey]) => {
        queryClient.setQueryData<IAdsListResponse>(queryKey, old => {
          if (!old) return old

          return { ...old, items: old.items.map(ad => (ad.id === id ? { ...ad, isFavorite: true } : ad)) }
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

      toast.error('Не удалось добавить в избранное')
    },

    // ✅ success
    onSuccess: () => {
      toast.success('Добавлено в избранное')

      queryClient.invalidateQueries({ queryKey: ['ads'] })
      queryClient.invalidateQueries({ queryKey: ['favorite-ads'] })
    }
  })

  return { addFavorite, isAddingFavorite }
}
