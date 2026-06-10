import { api } from '@/shared/api'

import { IAd } from '../types/ad.types'

class AdsService {
  private URL = 'ads'

  async create(data: FormData) {
    const response = await api.post(this.URL, data)
    return response
  }

  async findAll() {
    const response = await api.get(this.URL)
    return response
  }

  async findMyAds(): Promise<IAd[]> {
    const response = await api.get<IAd[]>(`${this.URL}/my`)
    return response
  }

  async update(id: string, data: FormData) {
    // Тоже убираем заголовки
    const response = await api.patch(`${this.URL}/${id}`, data)
    return response
  }
}

export const adsService = new AdsService()
