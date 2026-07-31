import api from './axios'

export const getAddresses = async () => {
  const response = await api.get('/shop/addresses/')
  return response.data.results || response.data
}

export const createAddress = async (addressData) => {
  const response = await api.post('/shop/addresses/', addressData)
  return response.data
}

export const updateAddress = async (id, addressData) => {
  const response = await api.patch(`/shop/addresses/${id}/`, addressData)
  return response.data
}

export const deleteAddress = async (id) => {
  await api.delete(`/shop/addresses/${id}/`)
}