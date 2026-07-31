import api from './axios'

export const getMyProfile = async () => {
  const response = await api.get('/shop/profile/')
  const data = response.data.results || response.data
  return data[0] || null
}

export const updateProfile = async (id, formData) => {
  const response = await api.patch(`/shop/profile/${id}/`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return response.data
}

export const updateAccount = async (data) => {
  const response = await api.patch('/shop/update-account/', data)
  return response.data
}