import { IUser } from '@/components/features/auth/types'

export function getPrimaryPhone(user?: IUser) {
  if (!user?.phones?.length) return ''

  return user.phones.find(phone => phone.isPrimary)?.phone ?? user.phones[0]?.phone ?? ''
}
