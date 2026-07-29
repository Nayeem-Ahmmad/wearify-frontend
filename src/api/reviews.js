import api from './axios'

export const getReviews = async (productId) => {
  const response = await api.get('/shop/reviews/', { params: { product: productId } })
  return response.data
}

export const postReview = async (productId, rating, comment) => {
  const response = await api.post('/shop/reviews/', { product: productId, rating, comment })
  return response.data
}