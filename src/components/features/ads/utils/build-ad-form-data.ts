import { TypeCreateAdSchema } from '../schemes'

export const buildAdFormData = (values: Partial<TypeCreateAdSchema>) => {
  const formData = new FormData()

  if (values.title) formData.append('title', values.title)
  if (values.description) formData.append('description', values.description)

  if (values.price !== undefined && values.price !== null && String(values.price).trim() !== '') {
    formData.append('price', String(values.price))
  }

  if (values.categoryId) formData.append('categoryId', values.categoryId)
  if (values.address) formData.append('address', values.address)

  if (values.lat !== undefined) formData.append('lat', String(values.lat))
  if (values.lng !== undefined) formData.append('lng', String(values.lng))

  // Раньше номер телефона нигде не попадал в FormData — что бы пользователь
  // ни выбрал/ввёл на странице объявления, на сервер всегда уходил "пустой"
  // phone, и бэкенд молча подставлял основной номер аккаунта вместо
  // выбранного. Из-за этого объявление всегда сохранялось с основным
  // номером, даже если для него явно выбрали другой.
  if (values.phone) formData.append('phone', values.phone)

  if (values.categoryFeatures) {
    formData.append('features', JSON.stringify(values.categoryFeatures))
  }

  return formData
}
