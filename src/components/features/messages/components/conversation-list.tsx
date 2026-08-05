import { IConversationListItem } from '../types/message.types'
import { ConversationListItem } from './conversation-list-item'

interface ConversationListProps {
  conversations: IConversationListItem[]
  activeId: string | null
  isLoading: boolean
  onSelect: (id: string) => void
}

export const ConversationList = ({ conversations, activeId, isLoading, onSelect }: ConversationListProps) => {
  return (
    <div className='-ml-3 flex w-full flex-col overflow-y-auto'>
      {isLoading && <div className='p-4 text-sm text-gray-400'>Загрузка...</div>}

      {!isLoading && conversations.length === 0 && (
        <div className='p-4 text-sm text-gray-500'>
          Пока нет ни одного диалога — напишите продавцу со страницы объявления.
        </div>
      )}

      {conversations.map(conversation => (
        <ConversationListItem
          key={conversation.id}
          conversation={conversation}
          isActive={conversation.id === activeId}
          onClick={() => onSelect(conversation.id)}
        />
      ))}
    </div>
  )
}
