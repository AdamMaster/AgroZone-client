'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useMemo } from 'react'

import { Heading } from '@/components/ui'

import { useConversations } from '../hooks'
import { ChatPane } from './chat-pane'
import { ConversationList } from './conversation-list'

export const MessagesClient = () => {
  const router = useRouter()
  const searchParams = useSearchParams()

  const activeConversationId = searchParams.get('c')
  const newAdId = searchParams.get('ad')

  const { conversations, isLoading } = useConversations()

  // Пришли по ссылке "Написать" с конкретного объявления, а диалог с этим
  // продавцом по нему уже существует — не показываем экран "нового"
  // диалога, а сразу открываем существующий (иначе первое сообщение,
  // отправленное через форму "нового" диалога, ушло бы мимо истории).
  const existingForAd = useMemo(
    () => (newAdId ? conversations.find(item => item.ad.id === newAdId) : undefined),
    [conversations, newAdId]
  )

  useEffect(() => {
    if (!existingForAd) return

    const params = new URLSearchParams(searchParams.toString())
    params.delete('ad')
    params.set('c', existingForAd.id)
    router.replace(`/profile/settings/messages?${params.toString()}`)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [existingForAd])

  const handleSelect = (id: string) => {
    router.push(`/profile/settings/messages?c=${id}`)
  }

  const handleStarted = (conversationId: string) => {
    router.replace(`/profile/settings/messages?c=${conversationId}`)
  }

  const handleBack = () => {
    router.push('/profile/settings/messages')
  }

  const isChatOpen = !!activeConversationId || !!newAdId

  return (
    <div className='max-w-[800px]'>
      <Heading level={2} className='mb-6'>
        Сообщения
      </Heading>

      <div className='flex h-[600px]'>
        {isChatOpen ? (
          <ChatPane
            activeConversationId={activeConversationId}
            conversations={conversations}
            newAdId={!activeConversationId ? newAdId : null}
            onStarted={handleStarted}
            onBack={handleBack}
          />
        ) : (
          <ConversationList
            conversations={conversations}
            isLoading={isLoading}
            activeId={activeConversationId}
            onSelect={handleSelect}
          />
        )}
      </div>
    </div>
  )
}
