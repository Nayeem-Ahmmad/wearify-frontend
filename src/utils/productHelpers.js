import { API_BASE_URL } from '../api/axios'

export const getProductImage = (product) => {
  if (!product) return 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=300&q=80'
  
  // 1. নতুন API থেকে first_image_url
  if (product.first_image_url) {
    return product.first_image_url
  }
  
  // 2. images array থেকে (নতুন structure)
  if (product.images && product.images.length > 0) {
    const img = product.images[0]
    const imageUrl = img.image_url || img.image
    if (imageUrl) {
      return imageUrl.startsWith('http') ? imageUrl : `${API_BASE_URL}${imageUrl}`
    }
  }
  
  // 3. Fallback
  return 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=300&q=80'
}

export const getProductImages = (product) => {
  if (!product) return ['https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=300&q=80']
  
  // 1. নতুন API থেকে all_image_urls
  if (product.all_image_urls && product.all_image_urls.length > 0) {
    return product.all_image_urls
  }
  
  // 2. images array থেকে (নতুন structure)
  if (product.images && product.images.length > 0) {
    return product.images.map((img) => {
      const imageUrl = img.image_url || img.image
      return imageUrl.startsWith('http') ? imageUrl : `${API_BASE_URL}${imageUrl}`
    })
  }
  
  // 3. Fallback
  return ['https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=300&q=80']
}

// Same as getProductImages, but keeps each image's tagged color so the
// gallery can drive color/size selection (Daraz-style).
export const getProductImagesWithColor = (product) => {
  if (!product) return [{ url: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=300&q=80', color: '' }]
  
  // 1. নতুন API থেকে all_image_urls (color info নেই, তাই images array ব্যবহার)
  if (product.images && product.images.length > 0) {
    return product.images.map((img) => {
      const imageUrl = img.image_url || img.image
      return {
        url: imageUrl.startsWith('http') ? imageUrl : `${API_BASE_URL}${imageUrl}`,
        color: img.color || '',
      }
    })
  }
  
  // 2. Fallback
  return [{ url: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=300&q=80', color: '' }]
}

export const getProductPrice = (product) => {
  if (!product) return 0
  if (product.variants && product.variants.length > 0) {
    return product.variants[0].price || product.base_price || 0
  }
  return product.base_price || 0
}

export const formatPrice = (price) => {
  const num = Number(price)
  return `৳${num.toLocaleString('en-BD')}`
}