import api from './axios'

export const getEvents = async (params = {}) => {
  const response = await api.get('/events', { params })
  return response.data
}

export const getAnnouncements = async (params = {}) => {
  const response = await api.get('/announcements', { params })
  return response.data
}