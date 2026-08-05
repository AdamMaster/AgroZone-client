import { Ellipsis } from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

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
        'ml relative flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left transition-colors hover:bg-gray-100',
        isActive && 'bg-gray-50'
      )}
    >
      <Avatar className='size-15'>
        <AvatarImage src={counterpart.picture ?? undefined} />
        <AvatarFallback className=''>{counterpart.displayName?.[0]?.toUpperCase() ?? '?'}</AvatarFallback>
      </Avatar>

      <div className='flex min-w-0 flex-1 flex-col gap-0.5'>
        <div className='flex items-center justify-between gap-2'>
          <p className={cn('text-[16px] leading-5 font-semibold')}>{counterpart.displayName ?? 'Пользователь'}</p>
          {lastMessage && (
            <span className='shrink-0 text-xs text-gray-400'>{formatMessageTime(lastMessage.createdAt)}</span>
          )}
        </div>
        <p className='truncate text-sm'>{ad.title}</p>
        {lastMessage && (
          <p className={cn('truncate pr-12 text-sm', isUnread ? 'text-gray-900' : 'text-gray-400')}>
            {lastMessage.text}
          </p>
        )}
      </div>

      {isUnread && <span className='bg-primary size-2 shrink-0 rounded-full' />}
      <DropdownMenu>
        <DropdownMenuTrigger>
          <button className='absolute right-3 bottom-3 flex size-9 items-center justify-center rounded-lg bg-white'>
            <Ellipsis className='size-5' />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Variant 1</DropdownMenuItem>
          <DropdownMenuItem>Variant 2</DropdownMenuItem>
          <DropdownMenuItem>Variant 3</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </button>
  )
}
