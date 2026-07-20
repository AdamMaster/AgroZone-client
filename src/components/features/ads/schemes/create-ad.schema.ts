import { z } from 'zod'

export const CreateAdSchema = z.object({
  title: z.string().min(3, 'Название должно быть не менее 3 символов'),
  description: z.string().min(10, 'Описание должно быть не менее 10 символов'),
  price: z.string().optional(),
  unit: z.string().default('pcs'),
  categoryId: z.string().uuid('Выберите корректную категорию'),
  images: z.array(z.any()).default([]),
  address: z.string().min(5, 'Укажите адрес'),
  lat: z.number().min(-90, 'Выберите местоположение'),
  lng: z.number().min(-180, 'Выберите местоположение'),
  categoryFeatures: z.record(z.string(), z.any()).optional().default({})
})

export type TypeCreateAdSchema = z.input<typeof CreateAdSchema>
