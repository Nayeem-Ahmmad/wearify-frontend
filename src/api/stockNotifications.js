import api from './axios'

export const subscribeStockNotification = async (variantId) => {
  const response = await api.post('/shop/stock-notifications/', { variant_id: variantId })
  return response.data
}

export const unsubscribeStockNotification = async (id) => {
  await api.delete(`/shop/stock-notifications/${id}/`)
}