import { useState } from 'react'
import type { FormEvent } from 'react'
import { getState } from './api'
import type { Credentials } from './api'

type Props = {
  onLogin: (creds: Credentials) => void
}

function LoginForm({ onLogin }: Props) {
  const [idInstance, setIdInstance] = useState('')
  const [apiTokenInstance, setApiTokenInstance] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const creds = { idInstance: idInstance.trim(), apiTokenInstance: apiTokenInstance.trim() }
    try {
      const state = await getState(creds)
      if (state === 'authorized') onLogin(creds)
      else setError(`Инстанс не авторизован: ${state}`)
    } catch {
      setError('Неверный idInstance или apiTokenInstance')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="login" onSubmit={handleSubmit}>
      <h1>Вход</h1>
      <input placeholder="idInstance" value={idInstance} onChange={(e) => setIdInstance(e.target.value)} />
      <input placeholder="apiTokenInstance" value={apiTokenInstance} onChange={(e) => setApiTokenInstance(e.target.value)} />
      <button disabled={loading || !idInstance || !apiTokenInstance}>Войти</button>
      {error && <p className="error">{error}</p>}
    </form>
  )
}

export default LoginForm
