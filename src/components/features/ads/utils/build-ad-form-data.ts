import { TypeCreateAdSchema } from '../schemes'

export const buildAdFormData = (values: TypeCreateAdSchema) => {
  const formData = new FormData()

  formData.append('title', values.title)
  formData.append('description', values.description)

  if (values.price?.trim()) {
    formData.append('price', values.price)
  }

  formData.append('categoryId', values.categoryId)
  formData.append('address', values.address ?? '')
  formData.append('lat', values.lat.toString())
  formData.append('lng', values.lng.toString())
  formData.append('features', JSON.stringify(values.features))

  return formData
}
