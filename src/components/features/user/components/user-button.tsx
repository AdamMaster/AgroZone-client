import { LogOut } from 'lucide-react'

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

  if (!user) return null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className={className}>
        <Avatar>
          <AvatarImage src={user.picture} />
          <AvatarFallback>{user.displayName.slice(0, 1)}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-40' align='end'>
        <DropdownMenuItem disabled={isLoadingLogout} onClick={() => logout()}>
          <LogOut className='mr-2 size-4' />
          Выйти
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function UserButtonLoading() {
  return <Skeleton className='h-8 w-8 rounded-full' />
}
