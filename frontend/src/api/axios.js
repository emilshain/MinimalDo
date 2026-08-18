import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api'

const api = axios.create({
  baseURL: BASE_URL,
})

// Attach the access token to every request.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// If a request fails with 401, try to refresh the access token once and retry.
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      const refresh = localStorage.getItem('refresh')

      if (refresh) {
        try {
          const { data } = await axios.post(`${BASE_URL}/token/refresh/`, { refresh })
          localStorage.setItem('access', data.access)
          originalRequest.headers.Authorization = `Bearer ${data.access}`
          return api(originalRequest)
        } catch (refreshError) {
          localStorage.removeItem('access')
          localStorage.removeItem('refresh')
          window.location.href = '/login'
        }
      }
    }

    return Promise.reject(error)
  }
)

export default api
