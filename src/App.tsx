import { useState } from 'react'
import type { Credentials } from './types'
import LoginForm from './components/LoginForm'
import Messenger from './components/Messenger'
import './App.css'

const STORAGE_KEY = 'credentials'

function App() {
  const [creds, setCreds] = useState<Credentials | null>(() => JSON.parse(sessionStorage.getItem(STORAGE_KEY) ?? 'null'))

  function login(creds: Credentials) {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(creds))
    setCreds(creds)
  }

  function logout() {
    sessionStorage.removeItem(STORAGE_KEY)
    setCreds(null)
  }

  return creds ? <Messenger creds={creds} onLogout={logout} /> : <LoginForm onLogin={login} />
}

export default App
