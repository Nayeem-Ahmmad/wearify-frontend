import api from './axios'

export const getWishlist = async () => {
  const response = await api.get('/shop/wishlist/')
  return response.data
}

export const addToWishlist = async (productId) => {
  const response = await api.post('/shop/wishlist/', { product_id: productId })
  return response.data
}

export const removeFromWishlist = async (wishlistItemId) => {
  await api.delete(`/shop/wishlist/${wishlistItemId}/`)
}


export const getSharedWishlist = async (token) => {
  const response = await api.get(`/shop/wishlist/shared/${token}/`)
  return response.data
}