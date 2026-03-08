import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const isAuthenticated = ref(false)

  // Usar variables de entorno con fallback por seguridad
  const ADMIN_USERNAME = import.meta.env.VITE_ADMIN_USERNAME || 'gorditocachipurry'
  const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'seal2026'

  const login = (username, password) => {
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      user.value = { username, role: 'admin' }
      isAuthenticated.value = true
      localStorage.setItem('auth', JSON.stringify({ authenticated: true }))
      return true
    }
    return false
  }

  const logout = () => {
    user.value = null
    isAuthenticated.value = false
    localStorage.removeItem('auth')
  }

  const checkAuth = () => {
    const auth = localStorage.getItem('auth')
    if (auth) {
      isAuthenticated.value = true
      user.value = { username: ADMIN_USERNAME, role: 'admin' }
    }
  }

  return { user, isAuthenticated, login, logout, checkAuth }
})