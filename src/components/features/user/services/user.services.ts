'use client'

import { api } from '@/shared/api'

import { IUser } from '../../auth/types'
import { TypeSettingsSchema } from '../schemes'

class UserServices {
  async findProfile() {
    const response = await api.get<IUser>('users/profile')

    return response
  }

  async updateProfile(body: TypeSettingsSchema) {
    const response = await api.patch<IUser>('users/profile', body)

    return response
  }
}

export const userServices = new UserServices()
