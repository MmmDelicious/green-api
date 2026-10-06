import { useState } from 'react'
import type { ChatInfo, Credentials } from '../types'
import { useMessages } from '../hooks/useMessages'
import NewChat from './NewChat'
import Chat from './Chat'

type Props = {
  creds: Credentials
  onLogout: () => void
}

function Messenger({ creds, onLogout }: Props) {
  const [chats, setChats] = useState<ChatInfo[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)
  const { messages, addMessage } = useMessages(creds)

  function openChat(chat: ChatInfo) {
    setChats((prev) => (prev.some((c) => c.chatId === chat.chatId) ? prev : [chat, ...prev]))
    setActiveId(chat.chatId)
  }

  const activeChat = chats.find((c) => c.chatId === activeId)

  return (
    <div className={activeChat ? 'layout chat-open' : 'layout'}>
      <aside className="sidebar">
        <div className="sidebar-header">
          <span>Чаты</span>
          <button className="link" onClick={onLogout}>
            Выйти
          </button>
        </div>
        <NewChat creds={creds} onCreate={openChat} />
        {chats.map((chat) => (
          <button
            key={chat.chatId}
            className={chat.chatId === activeId ? 'chat-item active' : 'chat-item'}
            onClick={() => setActiveId(chat.chatId)}
          >
            +{chat.phone}
          </button>
        ))}
      </aside>
      <main className="main">
        {activeChat ? (
          <Chat
            key={activeChat.chatId}
            creds={creds}
            chat={activeChat}
            messages={messages.filter((m) => m.chatId === activeChat.chatId)}
            onSent={addMessage}
            onBack={() => setActiveId(null)}
          />
        ) : (
          <p className="placeholder">Введите номер телефона, чтобы начать чат</p>
        )}
      </main>
    </div>
  )
}

export default Messenger
