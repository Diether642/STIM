import api from './axios'

// Dashboard
export const getAdminDashboard = async () => {
  const response = await api.get('/admin/dashboard')
  return response.data
}

// Destinations
export const getAdminDestinations = async (params = {}) => {
  const response = await api.get('/admin/destinations', { params })
  return response.data
}

export const createDestination = async (formData) => {
  const response = await api.post('/admin/destinations', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return response.data
}

export const updateDestination = async (id, data) => {
  const response = await api.put(`/admin/destinations/${id}`, data)
  return response.data
}

export const deleteDestination = async (id) => {
  const response = await api.delete(`/admin/destinations/${id}`)
  return response.data
}

// Submissions
export const getAdminSubmissions = async (params = {}) => {
  const response = await api.get('/admin/submissions', { params })
  return response.data
}

export const approveSubmission = async (id, notes = '') => {
  const response = await api.put(`/admin/submissions/${id}/approve`, { notes })
  return response.data
}

export const rejectSubmission = async (id, notes) => {
  const response = await api.put(`/admin/submissions/${id}/reject`, { notes })
  return response.data
}

// Users
export const getAdminUsers = async (params = {}) => {
  const response = await api.get('/admin/users', { params })
  return response.data
}

export const updateAdminUser = async (id, data) => {
  const response = await api.put(`/admin/users/${id}`, data)
  return response.data
}

export const deleteAdminUser = async (id) => {
  const response = await api.delete(`/admin/users/${id}`)
  return response.data
}

// Reports
export const getReportVisitors = async (days = 30) => {
  const response = await api.get('/admin/reports/visitors', { params: { days } })
  return response.data
}

export const getReportPopular = async (limit = 10) => {
  const response = await api.get('/admin/reports/popular', { params: { limit } })
  return response.data
}

export const getReportSearches = async () => {
  const response = await api.get('/admin/reports/searches')
  return response.data
}

// Locations
export const getMunicipalities = async () => {
  const response = await api.get('/municipalities')
  return response.data
}

export const getBarangays = async (municipalityId) => {
  const response = await api.get(`/municipalities/${municipalityId}/barangays`)
  return response.data
}

export const getCategories = async (type = '') => {
  const response = await api.get('/categories', { params: type ? { type } : {} })
  return response.data
}