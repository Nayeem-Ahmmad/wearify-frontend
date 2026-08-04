import { API_BASE_URL } from '../api/axios'

export const getProductImage = (product) => {
  if (product.images && product.images.length > 0) {
    const img = product.images[0].image
    return img.startsWith('http') ? img : `${API_BASE_URL}${img}`
  }
  return 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=300&q=80'
}

export const getProductImages = (product) => {
  if (product.images && product.images.length > 0) {
    return product.images.map((img) =>
      img.image.startsWith('http') ? img.image : `${API_BASE_URL}${img.image}`
    )
  }
  return ['https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=300&q=80']
}

// Same as getProductImages, but keeps each image's tagged color so the
// gallery can drive color/size selection (Daraz-style).
export const getProductImagesWithColor = (product) => {
  if (product.images && product.images.length > 0) {
    return product.images.map((img) => ({
      url: img.image.startsWith('http') ? img.image : `${API_BASE_URL}${img.image}`,
      color: img.color || '',
    }))
  }
  return [{ url: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=300&q=80', color: '' }]
}

export const getProductPrice = (product) => {
  if (product.variants && product.variants.length > 0) {
    return product.variants[0].price
  }
  return product.base_price
}

export const formatPrice = (price) => {
  const num = Number(price)
  return `৳${num.toLocaleString('en-BD')}`
}