import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { sendMessage } from '../api/greenApi'
import type { ChatInfo, Credentials, Message } from '../types'

type Props = {
  creds: Credentials
  chat: ChatInfo
  messages: Message[]
  onSent: (message: Message) => void
  onBack: () => void
}

function formatTime(time: number) {
  return new Date(time).toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' })
}

function Chat({ creds, chat, messages, onSent, onBack }: Props) {
  const [text, setText] = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const listRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    listRef.current?.scrollTo(0, listRef.current.scrollHeight)
  }, [messages])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const message = text.trim()
    setSending(true)
    setError('')
    try {
      const { idMessage } = await sendMessage(creds, chat.chatId, message)
      onSent({ id: idMessage, chatId: chat.chatId, text: message, outgoing: true, time: Date.now() })
      setText('')
    } catch {
      setError('Не удалось отправить сообщение')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="chat">
      <header>
        <button className="back" onClick={onBack}>
          ←
        </button>
        +{chat.phone}
      </header>
      <div className="messages" ref={listRef}>
        {messages.map((m) => (
          <div key={m.id} className={m.outgoing ? 'message outgoing' : 'message'}>
            {m.text}
            <span className="time">{formatTime(m.time)}</span>
          </div>
        ))}
      </div>
      {error && <p className="error chat-error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input autoComplete="off" placeholder="Сообщение" value={text} onChange={(e) => setText(e.target.value)} autoFocus />
        <button disabled={sending || !text.trim()}>Отправить</button>
      </form>
    </div>
  )
}

export default Chat
