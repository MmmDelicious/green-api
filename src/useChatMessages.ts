import { useEffect, useState } from 'react'
import { deleteNotification, getIncomingText, receiveNotification } from './api'
import type { Credentials } from './api'

export type Message = {
  id: string
  text: string
  outgoing: boolean
}

export function useChatMessages(creds: Credentials, chatId: string) {
  const [messages, setMessages] = useState<Message[]>([])

  function addMessage(message: Message) {
    setMessages((prev) => [...prev, message])
  }

  useEffect(() => {
    let active = true

    async function poll() {
      while (active) {
        try {
          const notification = await receiveNotification(creds)
          if (!notification) continue
          const text = getIncomingText(notification, chatId)
          if (text) addMessage({ id: notification.body.idMessage, text, outgoing: false })
          await deleteNotification(creds, notification.receiptId)
        } catch {
          await new Promise((resolve) => setTimeout(resolve, 3000))
        }
      }
    }

    poll()
    return () => {
      active = false
    }
  }, [creds, chatId])

  return { messages, addMessage }
}
