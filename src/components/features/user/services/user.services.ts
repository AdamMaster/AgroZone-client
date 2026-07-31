'use client'

import { api } from '@/shared/api'

import { IUser } from '../../auth/types'
import { TypeSettingsSchema } from '../schemes'
import { TypePasswordChangeSchema } from '../schemes/password-change.schema'

class UserServices {
  async findProfile() {
    const response = await api.get<IUser>('users/profile')

    return response
  }

  async updateProfile(body: TypeSettingsSchema) {
    const response = await api.patch<IUser>('users/profile', body)

    return response
  }

  async updateAvatar(file: File) {
    const formData = new FormData()
    formData.append('file', file)

    const response = await api.patch<IUser>('users/profile/avatar', formData)

    return response
  }

  async updatePassword(data: TypePasswordChangeSchema) {
    const { confirmPassword, ...payload } = data

    const response = await api.patch<boolean>('users/profile/password', payload)
    return response
  }

  async toggleTwoFactor() {
    const response = await api.patch<IUser>('users/2fa')

    return response
  }

  async requestAddPhone(phone: string) {
    const response = await api.post<{ success: boolean }>('users/profile/phones/request', {
      newPhone: phone
    })

    return response
  }

  async confirmAddPhone(code: string, makePrimary?: boolean) {
    const response = await api.patch<{ success: boolean }>('users/profile/phones/confirm', {
      code,
      makePrimary
    })

    return response
  }

  // Переключение основного номера среди уже подтверждённых номеров
  // аккаунта — без смс, номер уже подтверждён раньше.
  async setPrimaryPhone(phone: string) {
    const response = await api.patch<{ success: boolean }>('users/profile/phones/primary', {
      phone
    })

    return response
  }
}

export const userServices = new UserServices()
