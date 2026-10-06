import { useCallback, useEffect, useState } from 'react'
import { deleteNotification, parseMessage, receiveNotification } from '../api/greenApi'
import type { Credentials, Message } from '../types'

export function useMessages(creds: Credentials) {
  const [messages, setMessages] = useState<Message[]>([])

  const addMessage = useCallback((message: Message) => {
    setMessages((prev) => (prev.some((m) => m.id === message.id) ? prev : [...prev, message]))
  }, [])

  useEffect(() => {
    let active = true

    async function poll() {
      while (active) {
        try {
          const notification = await receiveNotification(creds)
          if (!notification) continue
          const message = parseMessage(notification)
          if (message) addMessage(message)
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
  }, [creds, addMessage])

  return { messages, addMessage }
}
