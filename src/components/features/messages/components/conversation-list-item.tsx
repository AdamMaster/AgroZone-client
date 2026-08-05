import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui'

import { cn } from '@/lib/utils'

import { IConversationListItem } from '../types/message.types'
import { formatMessageTime } from '../utils/format-message-time'

interface ConversationListItemProps {
  conversation: IConversationListItem
  isActive: boolean
  onClick: () => void
}

export const ConversationListItem = ({ conversation, isActive, onClick }: ConversationListItemProps) => {
  const { ad, counterpart, lastMessage, isUnread } = conversation

  return (
    <button
      type='button'
      onClick={onClick}
      className={cn(
        'flex w-full items-center gap-3 border-b px-3 py-3 text-left transition-colors hover:bg-gray-50',
        isActive && 'bg-gray-50'
      )}
    >
      <Avatar>
        <AvatarImage src={counterpart.picture ?? undefined} />
        <AvatarFallback>{counterpart.displayName?.[0]?.toUpperCase() ?? '?'}</AvatarFallback>
      </Avatar>

      <div className='min-w-0 flex-1'>
        <div className='flex items-center justify-between gap-2'>
          <p className={cn('truncate text-sm', isUnread ? 'font-semibold text-gray-900' : 'font-medium text-gray-700')}>
            {counterpart.displayName ?? 'Пользователь'}
          </p>
          {lastMessage && (
            <span className='shrink-0 text-[11px] text-gray-400'>{formatMessageTime(lastMessage.createdAt)}</span>
          )}
        </div>
        <p className='truncate text-xs text-gray-500'>{ad.title}</p>
        {lastMessage && (
          <p className={cn('truncate text-xs', isUnread ? 'font-medium text-gray-900' : 'text-gray-400')}>
            {lastMessage.text}
          </p>
        )}
      </div>

      {isUnread && <span className='bg-primary size-2 shrink-0 rounded-full' />}
    </button>
  )
}
