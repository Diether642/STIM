import api from './axios'

export const loginUser = async (credentials) => {
  const response = await api.post('/login', credentials)
  return response.data
}

export const registerUser = async (data) => {
  const response = await api.post('/register', data)
  return response.data
}

export const logoutUser = async () => {
  const response = await api.post('/logout')
  return response.data
}

export const getUser = async () => {
  const response = await api.get('/user')
  return response.data
}