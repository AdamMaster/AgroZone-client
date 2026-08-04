import { TypeCreateAdSchema } from '../schemes'

export const buildAdFormData = (values: Partial<TypeCreateAdSchema>) => {
  const formData = new FormData()

  if (values.title) formData.append('title', values.title)
  if (values.description) formData.append('description', values.description)

  if (values.price !== undefined && values.price !== null && String(values.price).trim() !== '') {
    formData.append('price', String(values.price))
  }

  if (values.unit) formData.append('unit', values.unit)

  if (values.categoryId) formData.append('categoryId', values.categoryId)
  if (values.address) formData.append('address', values.address)

  if (values.lat !== undefined) formData.append('lat', String(values.lat))
  if (values.lng !== undefined) formData.append('lng', String(values.lng))

  if (values.categoryFeatures) {
    formData.append('features', JSON.stringify(values.categoryFeatures))
  }

  return formData
}
