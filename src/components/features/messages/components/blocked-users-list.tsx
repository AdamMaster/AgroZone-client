'use client'

import { Avatar, AvatarFallback, AvatarImage, Button, Heading } from '@/components/ui'

import { useBlockedUsers, useUnblockUser } from '../hooks'

export const BlockedUsersList = () => {
  const { blockedUsers, isLoading } = useBlockedUsers()
  const { unblockUser, isUnblocking } = useUnblockUser()

  return (
    <div>
      <Heading level={2} className='mb-6'>
        Заблокированные пользователи
      </Heading>

      <div className='flex flex-col overflow-hidden rounded-xl border'>
        {isLoading && <div className='p-4 text-sm text-gray-400'>Загрузка...</div>}

        {!isLoading && blockedUsers.length === 0 && (
          <div className='p-4 text-sm text-gray-500'>
            Вы никого не заблокировали. Заблокировать пользователя можно из меню рядом с диалогом на странице
            "Сообщения".
          </div>
        )}

        {blockedUsers.map(user => (
          <div key={user.id} className='flex items-center gap-3 border-b p-3 last:border-b-0'>
            <Avatar>
              <AvatarImage src={user.picture ?? undefined} />
              <AvatarFallback>{user.displayName?.[0]?.toUpperCase() ?? '?'}</AvatarFallback>
            </Avatar>

            <p className='min-w-0 flex-1 truncate text-sm font-medium'>{user.displayName ?? 'Пользователь'}</p>

            <Button
              type='button'
              variant='outline'
              size='sm'
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
