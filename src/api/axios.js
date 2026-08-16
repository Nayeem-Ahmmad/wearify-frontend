import axios from 'axios'

export const API_BASE_URL = 'http://127.0.0.1:8000'

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  withCredentials: true,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status
    const originalRequest = error.config

    // Site-wide maintenance mode — backend middleware returns 503 with
    // { maintenance: true, message: "..." } for every non-admin request.
    // Broadcast it so App.jsx can swap the whole UI for a maintenance page.
    if (status === 503 && error.response?.data?.maintenance) {
      window.dispatchEvent(
        new CustomEvent('maintenance-mode', {
          detail: { message: error.response.data.message },
        })
      )
      return Promise.reject(error)
    }

    if (status === 401 && !originalRequest?._retry) {
      const isAuthEndpoint = originalRequest?.url?.includes('/token/')
      const hadToken = Boolean(localStorage.getItem('access_token'))

      if (!isAuthEndpoint && hadToken) {
        // The token we sent was stale/expired. Clear it and retry the same
        // request once WITHOUT it — most endpoints (browsing products,
        // categories, etc.) work fine anonymously and shouldn't force a
        // logged-out visitor into a login redirect just for browsing.
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        originalRequest._retry = true
        delete originalRequest.headers.Authorization
        return api(originalRequest)
      }
    }

    return Promise.reject(error)
  }
)

export default api