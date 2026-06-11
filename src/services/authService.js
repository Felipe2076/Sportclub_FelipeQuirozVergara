import api from './api'

const AUTH_KEY = 'gorilaToken'
const USER_KEY = 'gorilaUser'

export const authService = {
  async login(email, password) {
    const { data } = await api.post('/login', { email, password })
    localStorage.setItem(AUTH_KEY, data.token)
    localStorage.setItem(USER_KEY, JSON.stringify(data.user))
    return data.user
  },

  async register(name, email, password, role = 'User') {
    const { data } = await api.post('/register', { name, email, password, role })
    localStorage.setItem(AUTH_KEY, data.token)
    localStorage.setItem(USER_KEY, JSON.stringify(data.user))
    return data.user
  },

  logout() {
    localStorage.removeItem(AUTH_KEY)
    localStorage.removeItem(USER_KEY)
  },

  getToken() {
    return localStorage.getItem(AUTH_KEY)
  },

  getUser() {
    try {
      return JSON.parse(localStorage.getItem(USER_KEY))
    } catch {
      return null
    }
  },

  isAuthenticated() {
    return !!this.getToken()
  },

  hasRole(role) {
    const user = this.getUser()
    return user?.role === role
  },
}
