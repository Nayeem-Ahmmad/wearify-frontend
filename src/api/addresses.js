import api from './axios'

export const getAddresses = async () => {
  const response = await api.get('/shop/addresses/')
  return response.data
}

export const createAddress = async (addressData) => {
  const response = await api.post('/shop/addresses/', addressData)
  return response.data
}