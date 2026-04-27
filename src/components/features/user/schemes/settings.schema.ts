import { z } from 'zod'

export const SettingsSchema = z.object({
  name: z.string().min(2, { message: 'Имя должно быть не короче 2 символов' }),
  email: z.string().min(1, { message: 'Заполните почту' }).email({ message: 'Некорректная почта' })
})

export type TypeSettingsSchema = z.infer<typeof SettingsSchema>
