import api from './axios'

export const createOrder = async (addressId, itemIds = null, deliveryLocation = 'inside_dhaka', couponCode = '') => {
  const payload = { shipping_address_id: addressId, delivery_location: deliveryLocation }
  if (itemIds) payload.item_ids = itemIds
  if (couponCode) payload.coupon_code = couponCode
  const response = await api.post('/shop/orders/', payload)
  return response.data
}

export const initiatePayment = async (orderId, paymentMethod, phoneNumber) => {
  const response = await api.post(`/shop/payment/initiate/${orderId}/`, {
    payment_method: paymentMethod,
    phone_number: phoneNumber,
  })
  return response.data
}

export const applyCoupon = async (orderId, couponCode) => {
  const response = await api.post(`/shop/orders/${orderId}/apply_coupon/`, {
    coupon_code: couponCode,
  })
  return response.data
}

export const trackOrder = async (orderId) => {
  const response = await api.post('/shop/orders/track/', { order_id: orderId })
  return response.data
}

export const downloadInvoice = async (orderId, orderNumber) => {
  const response = await api.get(`/shop/orders/${orderId}/invoice/`, { responseType: 'blob' })
  const url = window.URL.createObjectURL(new Blob([response.data]))
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', `invoice-${orderNumber}.pdf`)
  document.body.appendChild(link)
  link.click()
  link.remove()
  window.URL.revokeObjectURL(url)
}

export const requestReturn = async (orderId, reason) => {
  const response = await api.post('/shop/returns/', { order: orderId, reason })
  return response.data
}