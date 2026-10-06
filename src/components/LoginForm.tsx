import { useState } from 'react'
import type { FormEvent } from 'react'
import { defaultApiUrl, getState } from '../api/greenApi'
import type { Credentials } from '../types'

type Props = {
  onLogin: (creds: Credentials) => void
}

function LoginForm({ onLogin }: Props) {
  const [apiUrl, setApiUrl] = useState('')
  const [idInstance, setIdInstance] = useState('')
  const [apiTokenInstance, setApiTokenInstance] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const id = idInstance.trim()
    const creds = {
      apiUrl: apiUrl.trim().replace(/\/+$/, '') || defaultApiUrl(id),
      idInstance: id,
      apiTokenInstance: apiTokenInstance.trim(),
    }
    try {
      const state = await getState(creds)
      if (state === 'authorized') onLogin(creds)
      else setError(`Инстанс не авторизован: ${state}`)
    } catch {
      setError('Неверный idInstance, apiTokenInstance или apiUrl')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="login" onSubmit={handleSubmit}>
      <h1>Вход</h1>
      <input placeholder="idInstance" value={idInstance} onChange={(e) => setIdInstance(e.target.value)} />
      <input placeholder="apiTokenInstance" value={apiTokenInstance} onChange={(e) => setApiTokenInstance(e.target.value)} />
      <input placeholder="apiUrl (необязательно)" value={apiUrl} onChange={(e) => setApiUrl(e.target.value)} />
      <button disabled={loading || !idInstance || !apiTokenInstance}>Войти</button>
      {error && <p className="error">{error}</p>}
    </form>
  )
}

export default LoginForm
