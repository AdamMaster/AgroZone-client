'use client'

import { useQuery } from '@tanstack/react-query'

import { notificationsService } from '../services'
import { INotification } from '../types/notification.types'

export function useNotifications() {
  const { data, isLoading } = useQuery<INotification[]>({
    queryKey: ['notifications'],
    queryFn: () => notificationsService.findMy()
  })

  return { notifications: data ?? [], isLoadingNotifications: isLoading }
}
