'use client'

import { Avatar, AvatarFallback, AvatarImage, Button, Heading, Loading } from '@/components/ui'

import { useBlockedUsers, useUnblockUser } from '../hooks'

export const BlockedUsersList = () => {
  const { blockedUsers, isLoading } = useBlockedUsers()
  const { unblockUser, isUnblocking } = useUnblockUser()

  return (
    <div className='h-full max-w-[800px]'>
      <Heading level={2} className='mb-6'>
        Черный список
      </Heading>

      <div className='relative flex h-full w-full flex-col gap-4 overflow-hidden'>
        {isLoading && <Loading />}

        {!isLoading && blockedUsers.length === 0 && (
          <div className='text-sm text-gray-500'>
            Вы никого не заблокировали. Заблокировать пользователя можно из меню рядом с диалогом на странице
            &quot;Сообщения&quot;.
          </div>
        )}

        {blockedUsers.map(user => (
          <div key={user.id} className='flex items-center gap-3'>
            <Avatar>
              <AvatarImage src={user.picture ?? undefined} />
              <AvatarFallback>{user.displayName?.[0]?.toUpperCase() ?? '?'}</AvatarFallback>
            </Avatar>

            <p className='min-w-0 flex-1 truncate text-sm font-medium'>{user.displayName ?? 'Пользователь'}</p>

            <Button
              type='button'
              variant='ghost'
              size='default'
              disabled={isUnblocking}
              onClick={() => unblockUser(user.id)}
            >
              Разблокировать
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}
