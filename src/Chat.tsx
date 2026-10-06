import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { sendMessage } from './api'
import type { Credentials } from './api'
import { useChatMessages } from './useChatMessages'

type Props = {
  creds: Credentials
  chatId: string
  phone: string
}

function Chat({ creds, chatId, phone }: Props) {
  const { messages, addMessage } = useChatMessages(creds, chatId)
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
      const { idMessage } = await sendMessage(creds, chatId, message)
      addMessage({ id: idMessage, text: message, outgoing: true })
      setText('')
    } catch {
      setError('Не удалось отправить сообщение')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="chat">
      <header>+{phone}</header>
      <div className="messages" ref={listRef}>
        {messages.map((m) => (
          <div key={m.id} className={m.outgoing ? 'message outgoing' : 'message'}>
            {m.text}
          </div>
        ))}
      </div>
      {error && <p className="error chat-error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input placeholder="Сообщение" value={text} onChange={(e) => setText(e.target.value)} />
        <button disabled={sending || !text.trim()}>Отправить</button>
      </form>
    </div>
  )
}

export default Chat
