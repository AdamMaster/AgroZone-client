import { api } from '@/shared/api'

import { IAd } from '../types/ad.types'
import { UpdateAdDto } from './../../../../../../server/src/ads/dto/update-ad.dto'

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

  async archive(id: string) {
    const response = await api.patch(`${this.URL}/${id}/archive`)

    return response
  }

  async activate(id: string) {
    const response = await api.patch(`${this.URL}/${id}/activate`)

    return response
  }

  async republish(id: string, data?: UpdateAdDto) {
    const response = await api.patch(`${this.URL}/${id}/republish`, data || {})
    return response
  }

  async saveDraft(data: FormData, id?: string) {
    const url = id ? `${this.URL}/draft?id=${id}` : `${this.URL}/draft`
    const response = await api.post(url, data)
    return response
  }

  async draft(id: string) {
    const response = await api.patch(`${this.URL}/${id}/draft`)

    return response
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async findAll(params?: Record<string, any>): Promise<IAd[]> {
    const response = await api.get<IAd[]>(this.URL, { params })
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

  async publishDraft(id: string) {
    return api.patch(`${this.URL}/${id}/publish-draft`)
  }

  async addFavorite(id: string): Promise<void> {
    await api.post(`${this.URL}/${id}/favorite`)
  }

  async removeFavorite(id: string): Promise<void> {
    await api.delete(`${this.URL}/${id}/favorite`)
  }

  async getFavorites(params?: { page?: number; limit?: number }): Promise<IAd[]> {
    const response = await api.get<IAd[]>(`${this.URL}/me/favorites`, {
      params
    })

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
