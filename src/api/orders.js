import api from './axios'

export const createOrder = async (addressId) => {
  const response = await api.post('/shop/orders/', {
    shipping_address_id: addressId,
  })
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