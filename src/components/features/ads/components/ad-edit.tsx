'use client'

import { Loading } from '@/components/ui'

import { useMyAd, useUpdateAd } from '../hooks'
import { TypeCreateAdSchema } from '../schemes'
import { ICategory, ICategoryFeature } from '../types/ad.types'
import { buildAdFormData } from '../utils/build-ad-form-data'
import { AdForm } from './ad-form'

interface AdEditProps {
  id: string
  categories: ICategory[]
}

export const AdEdit = ({ id, categories }: AdEditProps) => {
  const { ad, isLoading: isLoadingAd } = useMyAd(id)
  const { updateAd, isLoadingUpdate } = useUpdateAd(id)

  if (isLoadingAd || !ad) return <Loading />

  const initialData: TypeCreateAdSchema = {
    title: ad.title,
    description: ad.description,
    price: ad.price?.toString(),
    categoryId: ad.categoryId,
    address: ad.address,
    lat: ad.lat,
    lng: ad.lng,
    images: ad.images,
    categoryFeatures: (ad.features as ICategoryFeature) || {}
  }

  type AdImage = File | string

  const appendImages = (data: FormData, images: AdImage[] = []) => {
    images.forEach(img => {
      if (img instanceof File) {
        data.append('images', img)
      } else {
        data.append('existingImages', img)
      }
    })
  }

  const onSubmit = (values: TypeCreateAdSchema) => {
    const formData = buildAdFormData(values)

    if ((values.images ?? []).length === 0) {
      formData.append('existingImages', '')
    } else {
      appendImages(formData, values.images)
    }
    updateAd(formData)
  }

  return (
    <AdForm
      categories={categories}
      initialData={initialData}
      isSubmitting={isLoadingUpdate}
      rejectionReason={ad.rejectionReason}
      onSubmit={onSubmit}
    />
  )
}
