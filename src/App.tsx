import { useState } from 'react'
import type { Credentials } from './api'
import LoginForm from './LoginForm'
import NewChat from './NewChat'
import Chat from './Chat'
import './App.css'

type ChatInfo = {
  chatId: string
  phone: string
}

function App() {
  const [creds, setCreds] = useState<Credentials | null>(null)
  const [chat, setChat] = useState<ChatInfo | null>(null)

  if (!creds) return <LoginForm onLogin={setCreds} />

  return (
    <div className="layout">
      <aside className="sidebar">
        <NewChat creds={creds} onCreate={(chatId, phone) => setChat({ chatId, phone })} />
        {chat && <div className="chat-item">+{chat.phone}</div>}
      </aside>
      <main className="main">
        {chat ? (
          <Chat key={chat.chatId} creds={creds} chatId={chat.chatId} phone={chat.phone} />
        ) : (
          <p className="placeholder">Введите номер телефона, чтобы начать чат</p>
        )}
      </main>
    </div>
  )
}

export default App
