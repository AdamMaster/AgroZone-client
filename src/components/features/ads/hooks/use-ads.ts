'use client'

import { useQuery } from '@tanstack/react-query'

import { adsService } from '../services/ads.service'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useAds(params?: Record<string, any>) {
  const { data: ads = [], isLoading } = useQuery({
    queryKey: ['ads', params ?? {}],
    queryFn: () => adsService.findAll(params)
  })

  return { ads, isLoadingAds: isLoading }
}
