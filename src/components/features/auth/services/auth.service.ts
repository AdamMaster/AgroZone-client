import { api } from '@/shared/api'

import { TypeLoginSchema, TypeRegisterSchema } from '../schemes'
import { IUser } from '../types'

class AuthService {
  async register(body: TypeRegisterSchema, recaptcha?: string) {
    const headers = recaptcha ? { recaptcha } : undefined

    const response = await api.post<IUser>('auth/register', body, { headers })

    return response
  }
  async login(body: TypeLoginSchema, recaptcha?: string) {
    const headers = recaptcha ? { recaptcha } : undefined

    const response = await api.post<IUser>('auth/login', body, { headers })

    return response
  }

  async oauthByProvider(provider: 'google' | 'yandex') {
    const response = await api.get<{ url: string }>(`auth/oauth/connect/${provider}`)

    return response
  }

  async logout() {
    const response = await api.post('auth/logout')

    return response
  }
}

export const authService = new AuthService()
