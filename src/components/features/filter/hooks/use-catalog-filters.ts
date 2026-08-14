'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useMemo } from 'react'

import { CatalogFiltersState, FeatureFilterValue, FeatureFiltersMap } from '../types/filter.types'

const FEATURES_PARAM = 'features'

// Значение считается "пустым" — такое условие только засоряло бы URL и
// не добавляло бы никакого реального ограничения на запрос.
const isEmptyFeatureValue = (value: FeatureFilterValue): boolean => {
  if (Array.isArray(value)) return value.length === 0
  if (typeof value === 'boolean') return value === false
  return value.min === undefined && value.max === undefined
}

const parseFeatures = (raw: string | null): FeatureFiltersMap => {
  if (!raw) return {}

  try {
    const parsed = JSON.parse(raw)

    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      return parsed as FeatureFiltersMap
    }
  } catch {
    // Битый параметр в адресной строке (например, вручную отредактированный
    // URL) — просто игнорируем, а не роняем страницу.
  }

  return {}
}

type ScalarPatch = Partial<
  Pick<
    CatalogFiltersState,
    'sortBy' | 'unit' | 'minPrice' | 'maxPrice' | 'regionIsoCode' | 'localityFiasId' | 'sellerType'
  >
>

// Читает и обновляет параметры фильтра каталога прямо в URL
// (?sortBy=&unit=&minPrice=&maxPrice=&features=), тем же способом, каким
// уже работают ?search= и ?category= в AdsClient/SearchBar — так что
// отфильтрованный каталог остаётся обычной шарабельной ссылкой.
export function useCatalogFilters() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const state = useMemo<CatalogFiltersState>(
    () => ({
      sortBy: searchParams.get('sortBy') ?? undefined,
      unit: searchParams.get('unit') ?? undefined,
      minPrice: searchParams.get('minPrice') ?? undefined,
      maxPrice: searchParams.get('maxPrice') ?? undefined,
      regionIsoCode: searchParams.get('regionIsoCode') ?? undefined,
      localityFiasId: searchParams.get('localityFiasId') ?? undefined,
      sellerType: searchParams.get('sellerType') ?? undefined,
      features: parseFeatures(searchParams.get(FEATURES_PARAM))
    }),
    [searchParams]
  )

  const push = useCallback(
    (params: URLSearchParams) => {
      // Смена любого фильтра — это фактически новый поиск, начинаем с
      // первой страницы.
      params.delete('page')
      router.push(`${pathname}?${params.toString()}`, { scroll: false })
    },
    [router, pathname]
  )

  const update = useCallback(
    (patch: ScalarPatch) => {
      const params = new URLSearchParams(searchParams.toString())

      for (const [key, value] of Object.entries(patch)) {
        if (value === undefined || value === null || value === '') {
          params.delete(key)
        } else {
          params.set(key, value)
        }
      }

      push(params)
    },
    [searchParams, push]
  )

  const setFeatureValue = useCallback(
    (name: string, value: FeatureFilterValue | undefined) => {
      const nextFeatures: FeatureFiltersMap = { ...state.features }

      if (value === undefined || isEmptyFeatureValue(value)) {
        delete nextFeatures[name]
      } else {
        nextFeatures[name] = value
      }

      const params = new URLSearchParams(searchParams.toString())

      if (Object.keys(nextFeatures).length) {
        params.set(FEATURES_PARAM, JSON.stringify(nextFeatures))
      } else {
        params.delete(FEATURES_PARAM)
      }

      push(params)
    },
    [state.features, searchParams, push]
  )

  const reset = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString())
    ;[
      'sortBy',
      'unit',
      'minPrice',
      'maxPrice',
      'regionIsoCode',
      'localityFiasId',
      'sellerType',
      FEATURES_PARAM
    ].forEach(key => params.delete(key))
    push(params)
  }, [searchParams, push])

  const hasActiveFilters = Boolean(
    state.unit ||
    state.minPrice ||
    state.maxPrice ||
    state.regionIsoCode ||
    state.localityFiasId ||
    state.sellerType ||
    Object.keys(state.features).length
  )

  return { ...state, update, setFeatureValue, reset, hasActiveFilters }
}
