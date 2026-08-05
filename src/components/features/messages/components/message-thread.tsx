'use client'

import { useEffect, useRef } from 'react'

import { ScrollArea } from '@/components/ui'

import { useProfile } from '@/shared/hooks'

import { IMessage } from '../types/message.types'
import { MessageBubble } from './message-bubble'

interface MessageThreadProps {
  messages: IMessage[]
  isLoading: boolean
}

export const MessageThread = ({ messages, isLoading }: MessageThreadProps) => {
  const { user } = useProfile()
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: 'end' })
  }, [messages.length])

  if (isLoading) {
    return <div className='flex flex-1 items-center justify-center text-sm text-gray-400'>Загрузка...</div>
  }

  if (!messages.length) {
    return <div className='flex flex-1 items-center justify-center text-sm text-gray-400'>Сообщений пока нет</div>
  }

  return (
    <ScrollArea className='h-full min-h-0 grow py-3 pr-3'>
      <div className='flex grow flex-col justify-end gap-2'>
        {messages.map(message => (
          <MessageBubble key={message.id} message={message} isOwn={message.senderId === user?.id} />
        ))}
        <div ref={bottomRef} />
      </div>
    </ScrollArea>
  )
}
