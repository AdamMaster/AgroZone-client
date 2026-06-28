'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { adsService } from '../services/ads.service'
import { IAd } from '../types/ad.types'

export function useRemoveFavorite() {
  const queryClient = useQueryClient()

  const { mutate: removeFavorite, isPending: isRemovingFavorite } = useMutation({
    mutationKey: ['remove favorite'],

    mutationFn: (id: string) => adsService.removeFavorite(id),

    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: ['ads'] })

      const previousQueries = queryClient.getQueriesData<IAd[]>({
        queryKey: ['ads']
      })

      previousQueries.forEach(([queryKey]) => {
        queryClient.setQueryData<IAd[]>(queryKey, old => {
          if (!old) return old

          return old.map(ad => (ad.id === id ? { ...ad, isFavorite: false } : ad))
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
