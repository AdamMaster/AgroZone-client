import { api } from '@/shared/api'

import { ICategory } from '../types/categories.types'

class CategoriesService {
  private URL = 'categories'

  async findAll() {
    const response = await api.get<ICategory[]>(this.URL)

    return response
  }
}

export const categoriesService = new CategoriesService()
