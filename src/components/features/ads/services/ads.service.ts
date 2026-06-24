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

  async findAll(): Promise<IAd[]> {
    const response = await api.get<IAd[]>(this.URL)
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
