import type { Credentials, Message } from '../types'

type Notification = {
  receiptId: number
  body: {
    typeWebhook: string
    idMessage: string
    timestamp: number
    senderData?: { chatId: string }
    messageData?: {
      typeMessage: string
      textMessageData?: { textMessage: string }
      extendedTextMessageData?: { text: string }
    }
  }
}

function url({ idInstance, apiTokenInstance }: Credentials, method: string) {
  const host = `https://${idInstance.slice(0, 4)}.api.green-api.com`
  return `${host}/waInstance${idInstance}/${method}/${apiTokenInstance}`
}

async function request(input: string, init?: RequestInit) {
  const res = await fetch(input, init)
  if (!res.ok) throw new Error(`Ошибка ${res.status}`)
  return res.json()
}

function post(input: string, body: object) {
  return request(input, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

export async function getState(creds: Credentials): Promise<string> {
  const data = await request(url(creds, 'getStateInstance'))
  return data.stateInstance
}

export async function checkAccount(creds: Credentials, phone: string): Promise<string | null> {
  const data = await post(url(creds, 'checkAccount'), { phoneNumber: Number(phone) })
  return data.exist ? data.chatId : null
}

export function sendMessage(creds: Credentials, chatId: string, message: string): Promise<{ idMessage: string }> {
  return post(url(creds, 'sendMessage'), { chatId, message })
}

export function receiveNotification(creds: Credentials, signal: AbortSignal): Promise<Notification | null> {
  return request(url(creds, 'receiveNotification') + '?receiveTimeout=5', { signal })
}

export function deleteNotification(creds: Credentials, receiptId: number) {
  return request(url(creds, 'deleteNotification') + '/' + receiptId, { method: 'DELETE' })
}

export function parseMessage({ body }: Notification): Message | null {
  const outgoing = body.typeWebhook === 'outgoingMessageReceived' || body.typeWebhook === 'outgoingAPIMessageReceived'
  if (body.typeWebhook !== 'incomingMessageReceived' && !outgoing) return null
  const text = body.messageData?.textMessageData?.textMessage ?? body.messageData?.extendedTextMessageData?.text
  if (!text || !body.senderData) return null
  return {
    id: body.idMessage,
    chatId: body.senderData.chatId,
    text,
    outgoing,
    time: body.timestamp * 1000,
  }
}
