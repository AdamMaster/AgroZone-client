import { cn } from '@/lib/utils'

import { IMessage } from '../types/message.types'
import { formatMessageTime } from '../utils/format-message-time'

interface MessageBubbleProps {
  message: IMessage
  isOwn: boolean
}

export const MessageBubble = ({ message, isOwn }: MessageBubbleProps) => {
  return (
    <div className={cn('flex', isOwn ? 'justify-end' : 'justify-start')}>
      <div
        className={cn(
          'max-w-[75%] rounded-xl px-3.5 py-2 text-sm whitespace-pre-wrap',
          isOwn ? 'bg-primary text-white' : 'bg-gray-100 text-gray-900'
        )}
      >
        {message.text}
        <div className={cn('mt-1 text-right text-[11px]', isOwn ? 'text-white/70' : 'text-gray-400')}>
          {formatMessageTime(message.createdAt)}
        </div>
      </div>
    </div>
  )
}
