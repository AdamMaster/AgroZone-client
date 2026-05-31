import { z } from 'zod'

export const RegisterSmsPhoneSchema = z.object({
  phone: z.string().min(10, 'Минимум 10 цифр').max(15).regex(/^\d+$/, 'Только цифры')
})

export const RegisterSmsCodeSchema = z.object({
  code: z.string().length(4, 'Код должен быть из 4 цифр')
})

export const RegisterSmsFinalSchema = z
  .object({
    name: z.string().min(2, 'Имя обязательно'),
    password: z.string().min(6, 'Минимум 6 символов'),
    passwordRepeat: z.string()
  })
  .refine(data => data.password === data.passwordRepeat, {
    message: 'Пароли не совпадают',
    path: ['passwordRepeat']
  })

export type TypeRegisterSmsPhoneSchema = z.infer<typeof RegisterSmsPhoneSchema>
export type TypeRegisterSmsCodeSchema = z.infer<typeof RegisterSmsCodeSchema>
export type TypeRegisterSmsFinalSchema = z.infer<typeof RegisterSmsFinalSchema>
