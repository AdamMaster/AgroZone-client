import { z } from 'zod'

export const ChangePhoneSchema = z.object({
  phone: z.string().min(18, { message: 'Введите корректный номер телефона' })
})
export type TypeChangePhoneSchema = z.infer<typeof ChangePhoneSchema>

export const ChangePhoneCodeSchema = z.object({
  code: z.string().length(6, { message: 'Код должен состоять из 6 цифр' })
})
export type TypeChangePhoneCodeSchema = z.infer<typeof ChangePhoneCodeSchema>
