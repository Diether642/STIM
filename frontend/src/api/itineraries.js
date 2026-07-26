import api from './axios'

export const generateItinerary = async (preferences) => {
  const response = await api.post('/itineraries/generate', preferences)
  return response.data
}

export const getItineraries = async () => {
  const response = await api.get('/itineraries')
  return response.data
}

export const getItinerary = async (id) => {
  const response = await api.get(`/itineraries/${id}`)
  return response.data
}

export const deleteItinerary = async (id) => {
  const response = await api.delete(`/itineraries/${id}`)
  return response.data
}