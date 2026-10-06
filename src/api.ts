export type Credentials = {
  idInstance: string
  apiTokenInstance: string
}

export type Notification = {
  receiptId: number
  body: {
    typeWebhook: string
    idMessage: string
    senderData?: { chatId: string }
    messageData?: {
      typeMessage: string
      textMessageData?: { textMessage: string }
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

export function sendMessage(creds: Credentials, chatId: string, message: string) {
  return post(url(creds, 'sendMessage'), { chatId, message })
}

export function receiveNotification(creds: Credentials): Promise<Notification | null> {
  return request(url(creds, 'receiveNotification') + '?receiveTimeout=5')
}

export function deleteNotification(creds: Credentials, receiptId: number) {
  return request(url(creds, 'deleteNotification') + '/' + receiptId, { method: 'DELETE' })
}

export function getIncomingText({ body }: Notification, chatId: string): string | null {
  if (body.typeWebhook !== 'incomingMessageReceived') return null
  if (body.senderData?.chatId !== chatId) return null
  return body.messageData?.textMessageData?.textMessage ?? null
}
