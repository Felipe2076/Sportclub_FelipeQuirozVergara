import api from './api'

export async function getUsers() {
  const { data } = await api.get('/users')
  return data.data || []
}

export async function createUser(userData) {
  const { data } = await api.post('/users', {
    full_name: userData.name || userData.full_name,
    email: userData.email,
    password: userData.password,
    role: userData.role ? userData.role.toLowerCase() : 'user',
  })
  return data.data
}

export async function updateUser(id, userData) {
  const payload = {}
  if (userData.name || userData.full_name) payload.full_name = userData.name || userData.full_name
  if (userData.email) payload.email = userData.email
  if (userData.password) payload.password = userData.password
  if (userData.role) payload.role = userData.role.toLowerCase()
  const { data } = await api.put(/users/, payload)
  return data.data
}

export async function deleteUser(id) {
  await api.delete(/users/)
}
