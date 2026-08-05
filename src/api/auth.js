import api from './axios'

export const registerUser = async (username, email, password) => {
  const response = await api.post('/shop/register/', { username, email, password })
  return response.data
}

export const loginUser = async (username, password) => {
  const response = await api.post('/token/', { username, password })
  localStorage.setItem('access_token', response.data.access)
  localStorage.setItem('refresh_token', response.data.refresh)
  return response.data
}

export const logoutUser = () => {
  localStorage.removeItem('access_token')
  localStorage.removeItem('refresh_token')
}

export const isAuthenticated = () => {
  return !!localStorage.getItem('access_token')
}

export const requestPasswordReset = async (email) => {
  const response = await api.post('/shop/password-reset/request/', { email })
  return response.data
}

export const confirmPasswordReset = async (uid, token, newPassword) => {
  const response = await api.post('/shop/password-reset/confirm/', { uid, token, new_password: newPassword })
  return response.data
}