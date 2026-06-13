import { api } from '@/shared/api'

import { IAd } from '../types/ad.types'

class AdsService {
  private URL = 'ads'

  async create(data: FormData) {
    const response = await api.post(this.URL, data)
    return response
  }

  async publish(id: string) {
    const response = await api.patch(`${this.URL}/${id}/publish`)

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

  async findOneForOwner(id: string): Promise<IAd> {
    const response = await api.get<IAd>(`${this.URL}/my/${id}`)
    return response
  }

  async update(id: string, data: FormData) {
    const response = await api.patch(`${this.URL}/${id}`, data)
    return response
  }

  async remove(id: string) {
    const response = await api.delete(`${this.URL}/${id}`)
    return response
  }

  async reject(id: string, reason: string) {
    const response = await api.patch(`${this.URL}/${id}/reject`, { reason })

    return response
  }
}

export const adsService = new AdsService()
