// Пока единственный тип — отклонение объявления модератором (см.
// обсуждение с пользователем), но enum на бэкенде сделан расширяемым, тип
// здесь зеркалит это же намерение.
export type NotificationType = 'AD_REJECTED'

export interface INotification {
  id: string
  userId: string
  type: NotificationType
  title: string
  message: string
  link: string | null
  isRead: boolean
  createdAt: string
}

export interface IFindNotificationsParams {
  page?: number
  limit?: number
  isRead?: boolean
}

export interface IUnreadNotificationsCount {
  count: number
}
