import api from './axios'

export const getCart = async () => {
  const response = await api.get('/shop/cart/')
  return response.data
}

export const addToCart = async (variantId, quantity = 1) => {
  const response = await api.post('/shop/cart/add_item/', { variant_id: variantId, quantity })
  return response.data
}

export const removeFromCart = async (itemId) => {
  const response = await api.post('/shop/cart/remove_item/', { item_id: itemId })
  return response.data
}

export const updateCartItem = async (itemId, quantity) => {
  const response = await api.post('/shop/cart/update_item/', { item_id: itemId, quantity })
  return response.data
}