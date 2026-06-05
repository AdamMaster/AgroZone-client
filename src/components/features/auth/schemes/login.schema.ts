import { z } from 'zod'

// Регулярное выражение для проверки телефона (РФ формат: +7, 7, 8 и 10 цифр)
const phoneRegex = /^(\+7|7|8)?[\s\-]?\(?[49][0-9]{2}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/

export const LoginSchema = z.object({
  login: z
    .string()
    .min(1, { message: 'Заполните поле' })
    .refine(value => z.string().email().safeParse(value).success || phoneRegex.test(value), {
      message: 'Некорректная почта или номер телефона'
    }),
  password: z.string().min(6, { message: 'Пароль минимум 6 символов' }),
  code: z.optional(z.string())
})

export type TypeLoginSchema = z.infer<typeof LoginSchema>
