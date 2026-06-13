'use client'

import { useCreateAd } from '../hooks'
import { TypeCreateAdSchema } from '../schemes'
import { ICategory } from '../types/ad.types'
import { buildAdFormData } from '../utils/build-ad-form-data'
import { AdForm } from './ad-form'

export const AdCreate = ({ categories }: { categories: ICategory[] }) => {
  const { createAd, isLoadingCreate } = useCreateAd()

  const onSubmit = (values: TypeCreateAdSchema) => {
    const formData = buildAdFormData(values)

    values.images?.forEach(file => {
      formData.append('images', file)
    })

    createAd(formData)
  }

  return <AdForm categories={categories} onSubmit={onSubmit} isSubmitting={isLoadingCreate} />
}
