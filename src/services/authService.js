import api from './api'

const AUTH_KEY = 'sportToken'
const USER_KEY = 'sportUser'

function normalizeUser(user) {
  if (!user) return null
  const role = (user.role || '').toLowerCase()
  let normalizedRole = 'User'
  if (role === 'admin' || role === 'administrador') {
    normalizedRole = 'Admin'
  } else if (role === 'coach') {
    normalizedRole = 'Coach'
  } else if (role === 'user') {
    normalizedRole = 'User'
  }

  return {
    id: user.id,
    name: user.full_name || user.name || '',
    email: user.email || '',
    role: normalizedRole,
    full_name: user.full_name || user.name || '',
  }
}

export const authService = {
  async login(email, password) {
    const { data } = await api.post('/auth/login', { email, password })
    // New API response format: { ok, message, data: { token, user } }
    const { token, user: rawUser } = data.data
    const user = normalizeUser(rawUser)
    localStorage.setItem(AUTH_KEY, token)
    localStorage.setItem(USER_KEY, JSON.stringify(user))
    return user
  },

  async register(full_name, email, password) {
    const { data } = await api.post('/auth/register', { full_name, email, password })
    // New API response format: { ok, message, data: { token, user } }
    const { token, user: rawUser } = data.data
    const user = normalizeUser(rawUser)
    localStorage.setItem(AUTH_KEY, token)
    localStorage.setItem(USER_KEY, JSON.stringify(user))
    return user
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
