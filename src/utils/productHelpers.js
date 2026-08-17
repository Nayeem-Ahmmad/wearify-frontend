// utils/productHelpers.js

import { API_BASE_URL } from '../api/axios'

// ===== SINGLE IMAGE =====
export const getProductImage = (product) => {
  if (!product) {
    return 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=300&q=80'
  }

  // 1. New API: first_image_url
  if (product.first_image_url) {
    return product.first_image_url
  }

  // 2. images array from new API (image_url)
  if (product.images && Array.isArray(product.images) && product.images.length > 0) {
    const img = product.images[0]
    const imageUrl = img?.image_url || img?.image || null
    if (imageUrl) {
      return imageUrl.startsWith('http') ? imageUrl : `${API_BASE_URL}${imageUrl}`
    }
  }

  // 3. Fallback image
  return 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=300&q=80'
}

// ===== ALL IMAGES (Array) =====
export const getProductImages = (product) => {
  if (!product) {
    return ['https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=300&q=80']
  }

  // 1. New API: all_image_urls
  if (product.all_image_urls && Array.isArray(product.all_image_urls) && product.all_image_urls.length > 0) {
    return product.all_image_urls
  }

  // 2. images array from new API (image_url)
  if (product.images && Array.isArray(product.images) && product.images.length > 0) {
    return product.images
      .map((img) => {
        const imageUrl = img?.image_url || img?.image || null
        if (!imageUrl) return null
        return imageUrl.startsWith('http') ? imageUrl : `${API_BASE_URL}${imageUrl}`
      })
      .filter(Boolean)
  }

  // 3. Fallback
  return ['https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=300&q=80']
}

// ===== ALIAS for backward compatibility =====
export const getAllProductImages = getProductImages

// ===== IMAGES WITH COLOR =====
export const getProductImagesWithColor = (product) => {
  if (!product) {
    return [{ url: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=300&q=80', color: '' }]
  }

  // all_image_urls doesn't have color info, so use images array
  if (product.images && Array.isArray(product.images) && product.images.length > 0) {
    return product.images
      .map((img) => {
        const imageUrl = img?.image_url || img?.image || null
        if (!imageUrl) return null
        return {
          url: imageUrl.startsWith('http') ? imageUrl : `${API_BASE_URL}${imageUrl}`,
          color: img?.color || '',
        }
      })
      .filter(Boolean)
  }

  // Fallback
  return [{ url: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=300&q=80', color: '' }]
}

// ===== PRODUCT PRICE =====
export const getProductPrice = (product) => {
  if (!product) return 0
  if (product.variants && Array.isArray(product.variants) && product.variants.length > 0) {
    return product.variants[0]?.price || product.base_price || 0
  }
  return product.base_price || 0
}

// ===== FORMAT PRICE =====
export const formatPrice = (price) => {
  const num = Number(price) || 0
  return `৳${num.toLocaleString('en-BD')}`
}