'use client'

import { useEffect, useState } from 'react'

import { Input, Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui'

import { PRICE_UNITS } from '@/shared/constants/units'
import { USER_TYPE_LABELS, USER_TYPE_OPTIONS } from '@/shared/constants/user-types'

import { UserType } from '../../auth/types'
import { useCurrentCategory } from '../../categories/hooks/use-current-category'
import { ICategory } from '../../categories/types'
import { useCatalogFilters } from '../hooks/use-catalog-filters'
import { getEffectivePriceUnits } from '../utils/price-units'
import { FilterFeatureField } from './filter-feature-field'
import { LocationFilter } from './location-filter'
import { SubcategoryList } from './subcategory-list'

interface FilterProps {
  categories: ICategory[]
}

export const Filter = ({ categories }: FilterProps) => {
  const category = useCurrentCategory(categories)
  const filters = useCatalogFilters()

  if (!category) {
    return <aside className='text-sm text-gray-500'>Выберите категорию слева, чтобы отфильтровать объявления.</aside>
  }

  const isLeafCategory = !category.children || category.children.length === 0

  // Динамические характеристики (CategoryFeature) осмысленны только для
  // конкретного товара — родительская категория ("Фрукты и овощи") может
  // объединять листья с совершенно разными наборами полей (сорт яблока и
  // сорт винограда — разные характеристики), поэтому показываем их только
  // на листе (как и на странице подачи объявления, см. ad-form.tsx). А вот
  // цену и список подкатегорий — на любом уровне, включая родительский.
  const filterableFeatures = isLeafCategory
    ? (category.categoryFeatures ?? []).filter(f => f.filterable && f.type !== 'TEXT')
    : []

  return (
    <aside className='flex flex-col gap-6'>
      {filters.hasActiveFilters && (
        <button type='button' onClick={filters.reset} className='text-secondary self-start text-sm hover:underline'>
          Сбросить фильтры
        </button>
      )}

      <PriceRangeFilter priceUnits={getEffectivePriceUnits(category)} />

      {!isLeafCategory && <SubcategoryList category={category} />}

      <LocationFilter
        value={{ regionIsoCode: filters.regionIsoCode, localityFiasId: filters.localityFiasId }}
        onChange={patch => filters.update(patch)}
      />

      <SellerTypeFilter value={filters.sellerType} onChange={sellerType => filters.update({ sellerType })} />

      {filterableFeatures.map(feature => (
        <FilterFeatureField
          key={feature.id}
          feature={feature}
          value={filters.features[feature.name]}
          onChange={value => filters.setFeatureValue(feature.name, value)}
        />
      ))}
    </aside>
  )
}

interface PriceRangeFilterProps {
  priceUnits: string[]
}

const PriceRangeFilter = ({ priceUnits }: PriceRangeFilterProps) => {
  const filters = useCatalogFilters()

  const [unit, setUnit] = useState(filters.unit ?? priceUnits[0] ?? 'ITEM')
  const [min, setMin] = useState(filters.minPrice ?? '')
  const [max, setMax] = useState(filters.maxPrice ?? '')

  useEffect(() => {
    setUnit(filters.unit ?? priceUnits[0] ?? 'ITEM')
  }, [filters.unit, priceUnits])

  useEffect(() => {
    setMin(filters.minPrice ?? '')
  }, [filters.minPrice])

  useEffect(() => {
    setMax(filters.maxPrice ?? '')
  }, [filters.maxPrice])

  const commit = (nextUnit: string, nextMin: string, nextMax: string) => {
    if (!nextMin.trim() && !nextMax.trim()) {
      filters.update({ unit: undefined, minPrice: undefined, maxPrice: undefined })
      return
    }

    const parsedMin = nextMin.trim() === '' ? undefined : Number(nextMin)
    const parsedMax = nextMax.trim() === '' ? undefined : Number(nextMax)

    if ((parsedMin !== undefined && !Number.isFinite(parsedMin)) || (parsedMax !== undefined && !Number.isFinite(parsedMax))) {
      return
    }

    filters.update({
      unit: nextUnit,
      minPrice: parsedMin !== undefined ? String(parsedMin) : undefined,
      maxPrice: parsedMax !== undefined ? String(parsedMax) : undefined
    })
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') e.currentTarget.blur()
  }

  return (
    <div className='flex flex-col gap-2'>
      <Label>Цена</Label>
      <div className='flex gap-2'>
        <Input
          type='number'
          placeholder='От'
          value={min}
          onChange={e => setMin(e.target.value)}
          onBlur={() => commit(unit, min, max)}
          onKeyDown={onKeyDown}
          className='h-11'
        />
        <Input
          type='number'
          placeholder='До'
          value={max}
          onChange={e => setMax(e.target.value)}
          onBlur={() => commit(unit, min, max)}
          onKeyDown={onKeyDown}
          className='h-11'
        />
      </div>

      {priceUnits.length > 1 && (
        <Select
          value={unit}
          onValueChange={(val: string | null) => {
            const nextUnit = val ?? priceUnits[0] ?? 'ITEM'
            setUnit(nextUnit)
            commit(nextUnit, min, max)
          }}
        >
          <SelectTrigger className='h-11! px-4'>
            <SelectValue placeholder='Единица цены'>
              {(value: string | null) => (value ? (PRICE_UNITS[value] ?? value) : 'Единица цены')}
            </SelectValue>
          </SelectTrigger>
          <SelectContent alignItemWithTrigger={false} align='start'>
            {priceUnits.map(u => (
              <SelectItem key={u} value={u} className='rounded-none px-4'>
                {PRICE_UNITS[u] ?? u}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  )
}

interface SellerTypeFilterProps {
  value?: string
  onChange: (value: string | undefined) => void
}

const SellerTypeFilter = ({ value, onChange }: SellerTypeFilterProps) => {
  return (
    <div className='flex flex-col gap-2'>
      <Label>Тип продавца</Label>
      <Select value={value ?? ''} onValueChange={(val: string | null) => onChange(val || undefined)}>
        <SelectTrigger className='h-11! px-4'>
          <SelectValue placeholder='Все продавцы'>
            {(v: string | null) => (v ? (USER_TYPE_LABELS[v as UserType] ?? v) : 'Все продавцы')}
          </SelectValue>
        </SelectTrigger>
        <SelectContent alignItemWithTrigger={false} align='start'>
          <SelectItem value='' className='rounded-none px-4'>
            Все продавцы
          </SelectItem>
          {USER_TYPE_OPTIONS.map(option => (
            <SelectItem key={option.value} value={option.value} className='rounded-none px-4'>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
