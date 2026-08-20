import api from './axios'

export const getProducts = async (params = {}) => {
  const response = await api.get('/shop/products/', { params })
  return response.data
}

export const getProduct = async (slug) => {
  const response = await api.get(`/shop/products/${slug}/`)
  return response.data
}

export const getRelatedProducts = async (slug) => {
  const response = await api.get(`/shop/products/${slug}/related/`)
  return response.data
}

export const getCategories = async () => {
  const response = await api.get('/shop/categories/')
  return response.data
}

export const getBrands = async () => {
  const response = await api.get('/shop/brands/')
  return response.data
}

export const getDeals = async (params = {}) => {
  const response = await api.get('/shop/products/deals/', { params })
  return response.data
}

export const getActiveFlashSale = async () => {
  const response = await api.get('/shop/flash-sale/active/')
  return response.data
}

export const getBanners = () => api.get('/shop/banners/').then(res => res.data)