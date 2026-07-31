import { z } from 'zod'

export const SettingsSchema = z.object({
  name: z.string().min(2, { message: 'Имя должно быть не короче 2 символов' })
})

export type TypeSettingsSchema = z.infer<typeof SettingsSchema>
