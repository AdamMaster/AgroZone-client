'use client'

import { AdsClient } from '@/components/features/ads/components'

import { useHomeLocationStore } from '@/store'

// Обёртка над AdsClient специально для главной — подставляет "домашний"
// регион пользователя (см. HomeLocationPicker) как фильтр локации, вместо
// того чтобы показывать вообще все объявления по стране одной кучей. На
// страницу каталога (та же AdsClient) не влияет — там свой, независимый
// выбор локации через LocationFilter/useCatalogFilters (URL), locationOverride
// туда никогда не передаётся.
export const HomeAdsFeed = () => {
  const { location } = useHomeLocationStore()

  return (
    <AdsClient
      locationOverride={{
        regionIsoCode: location.regionIsoCode,
        localityFiasId: location.localityFiasId
      }}
    />
  )
}
