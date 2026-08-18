import { createContext, useContext, useState } from 'react'
import axios from 'axios'
import api from '../api/axios'

const AuthContext = createContext(null)

const BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api'

export function AuthProvider({ children }) {
  const [username, setUsername] = useState(localStorage.getItem('username'))

  const login = async (usernameInput, password) => {
    const { data } = await axios.post(`${BASE_URL}/token/`, {
      username: usernameInput,
      password,
    })
    localStorage.setItem('access', data.access)
    localStorage.setItem('refresh', data.refresh)
    localStorage.setItem('username', usernameInput)
    setUsername(usernameInput)
  }

  const register = async (usernameInput, password) => {
    await api.post('/register/', { username: usernameInput, password })
    await login(usernameInput, password)
  }

  const logout = () => {
    localStorage.removeItem('access')
    localStorage.removeItem('refresh')
    localStorage.removeItem('username')
    setUsername(null)
  }

  return (
    <AuthContext.Provider value={{ username, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
