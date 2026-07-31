import { z } from 'zod'

export const AddPhoneSchema = z.object({
  phone: z.string().min(18, 'Введите номер телефона')
})

export type TypeAddPhoneSchema = z.infer<typeof AddPhoneSchema>

// generateSmsCode() на бэкенде генерирует 6-значный код (раньше было 4 —
// усилили защиту от перебора). Тут длина должна совпадать с сервером,
// иначе форма технически не может отправить валидный код: он либо
// обрежется по maxLength, либо не пройдёт эту схему.
export const PhoneCodeSchema = z.object({
  code: z.string().length(6, { message: 'Код должен состоять из 6 цифр' })
})
export type TypePhoneCodeSchema = z.infer<typeof PhoneCodeSchema>
