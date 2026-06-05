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

  async requestPhoneChange(newPhone: string) {
    const response = await api.post<{ success: boolean }>('users/profile/change-phone/request', {
      newPhone
    })

    return response
  }

  async confirmPhoneChange(code: string) {
    const response = await api.patch<{ success: boolean }>('users/profile/change-phone/confirm', {
      code
    })

    return response
  }
}

export const userServices = new UserServices()
