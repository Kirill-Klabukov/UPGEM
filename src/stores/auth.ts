import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const isAuthenticated = ref(false)
  const hasPassword = ref(false)
  const user = ref<{ id: string; email?: string; name?: string } | null>(null)

  const setAuthenticated = (value: boolean, withPassword = false) => {
    isAuthenticated.value = value
    hasPassword.value = withPassword
    if (value) {
      localStorage.setItem('skillEdAuth', 'true')
      if (withPassword) {
        localStorage.setItem('skillEdHasPassword', 'true')
      }
    } else {
      localStorage.removeItem('skillEdAuth')
    }
  }

  const skipPassword = () => {
    isAuthenticated.value = true
    hasPassword.value = false
    user.value = { id: 'local-user', name: 'Guest' }
    localStorage.setItem('skillEdAuth', 'true')
    localStorage.setItem('skillEdSetup', 'no-password')
  }

  const login = (email: string, password: string) => {
    // TODO: Call backend authentication
    isAuthenticated.value = true
    hasPassword.value = true
    user.value = { id: '1', email }
    localStorage.setItem('skillEdAuth', 'true')
    localStorage.setItem('skillEdHasPassword', 'true')
  }

  const logout = () => {
    isAuthenticated.value = false
    user.value = null
    localStorage.removeItem('skillEdAuth')
  }

  const enablePassword = (password: string) => {
    // Enable password protection after initially skipping it
    localStorage.setItem('skillEdPassword', btoa(password))
    localStorage.setItem('skillEdSetup', 'password')
    localStorage.setItem('skillEdHasPassword', 'true')
    hasPassword.value = true
  }

  const disablePassword = () => {
    // Remove password protection
    localStorage.removeItem('skillEdPassword')
    localStorage.setItem('skillEdSetup', 'no-password')
    localStorage.setItem('skillEdHasPassword', 'false')
    hasPassword.value = false
  }

  return {
    isAuthenticated,
    hasPassword,
    user,
    setAuthenticated,
    skipPassword,
    login,
    logout,
    enablePassword,
    disablePassword,
  }
})
