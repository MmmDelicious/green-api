export type Credentials = {
  apiUrl: string
  idInstance: string
  apiTokenInstance: string
}

export type ChatInfo = {
  chatId: string
  phone: string
}

export type Message = {
  id: string
  chatId: string
  text: string
  outgoing: boolean
  time: number
}
