import api from './api'

export async function getSports() {
  const { data } = await api.get('/sports')
  return data.data || []
}

export async function getSportById(id) {
  const { data } = await api.get(`/sports/${id}`)
  return data.data
}

export async function createSport(payload) {
  const { data } = await api.post('/sports', payload)
  return data.data
}

export async function updateSport(id, payload) {
  const { data } = await api.put(`/sports/${id}`, payload)
  return data.data
}

export async function deleteSport(id) {
  await api.delete(`/sports/${id}`)
}

export async function toggleSportStatus(id, status) {
  const { data } = await api.patch(`/sports/${id}/status`, { status })
  return data.data
}
