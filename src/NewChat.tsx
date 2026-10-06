import { useState } from 'react'
import type { FormEvent } from 'react'
import { checkAccount } from './api'
import type { Credentials } from './api'

type Props = {
  creds: Credentials
  onCreate: (chatId: string, phone: string) => void
}

function NewChat({ creds, onCreate }: Props) {
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const digits = phone.replace(/\D/g, '').replace(/^8/, '7')
    try {
      const chatId = await checkAccount(creds, digits)
      if (chatId) onCreate(chatId, digits)
      else setError('Аккаунт с таким номером не найден')
    } catch {
      setError('Не удалось проверить номер')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="new-chat" onSubmit={handleSubmit}>
      <input placeholder="Номер телефона, например 79991234567" value={phone} onChange={(e) => setPhone(e.target.value)} />
      <button disabled={loading || !phone}>Создать чат</button>
      {error && <p className="error">{error}</p>}
    </form>
  )
}

export default NewChat
