'use client'

import { LogOut, Settings } from 'lucide-react'
import { useRouter } from 'next/navigation'

import { Avatar, AvatarFallback, AvatarImage, Skeleton } from '@/components/ui'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

import { IUser } from '../../auth/types'
import { useLogoutMutation } from '../hooks'

interface UserButtonProps {
  className?: string
  user: IUser
}

export const UserButton = ({ className, user }: UserButtonProps) => {
  const { logout, isLoadingLogout } = useLogoutMutation()
  const router = useRouter()

  if (!user) return null

  const onPersonalDataClick = () => {
    router.push('/profile/settings/general')
  }

  const onSecurityClick = () => {
    router.push('/profile/settings/security')
  }

  const onMyAdsClick = () => {
    router.push('/profile/settings/ads')
  }
  const onMyFavoritesClick = () => {
    router.push('/profile/settings/favorites')
  }

  const list = [
    { id: 'general', text: 'Личные данные', onClick: () => onPersonalDataClick() },
    { id: 'security', text: 'Безопасность', onClick: () => onSecurityClick() },
    { id: 'ads', text: 'Мои объявления', onClick: () => onMyAdsClick() },
    { id: 'favorites', text: 'Избранное', onClick: () => onMyFavoritesClick() }
  ]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className={className}>
        <Avatar>
          <AvatarImage src={user.picture} />
          <AvatarFallback>{user.displayName?.slice(0, 1)}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-40' align='end'>
        {list.map(item => (
          <DropdownMenuItem disabled={isLoadingLogout} onClick={item.onClick} key={item.id}>
            {item.text}
          </DropdownMenuItem>
        ))}
        <DropdownMenuItem disabled={isLoadingLogout} onClick={() => logout()} className='text-gray-500'>
          Выйти
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function UserButtonLoading() {
  return <Skeleton className='h-8 w-8 rounded-full' />
}
