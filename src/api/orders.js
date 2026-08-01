import api from './axios'

export const createOrder = async (addressId, itemIds = null, deliveryLocation = 'inside_dhaka') => {
  const payload = { shipping_address_id: addressId, delivery_location: deliveryLocation }
  if (itemIds) payload.item_ids = itemIds
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