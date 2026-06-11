import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: { 'X-API-Key': 'gsk_69fc31b7a9eecdfa6616b19a19a06aad0162aedb56e90c65' },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('gorilaToken')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('gorilaToken')
      localStorage.removeItem('gorilaUser')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  },
)

export default api
