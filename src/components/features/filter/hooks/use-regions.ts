'use client'

import { useQuery } from '@tanstack/react-query'

import { adsService } from '../../ads/services/ads.service'

// Список регионов почти не меняется в течение дня (пополняется только
// когда кто-то публикует объявление в регионе, где раньше объявлений не
// было), а дёргается фильтром гораздо чаще, чем форма объявления DaData —
// поэтому кэшируем подольше и не бьём по бэкенду на каждое открытие
// фильтра.
export function useRegions() {
  const { data, isLoading } = useQuery({
    queryKey: ['ads-regions'],
    queryFn: () => adsService.findRegions(),
    staleTime: 5 * 60 * 1000
  })

  return { regions: data ?? [], isLoadingRegions: isLoading }
}
