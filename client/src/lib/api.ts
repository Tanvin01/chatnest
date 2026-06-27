import axios from 'axios'
import { useAuthStore } from '../store/authStore'

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:4000'

export const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
})

// Request interceptor — inject auth token
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor — handle 401 and token refresh
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config

    if (err.response?.status === 401 && !original._retry) {
      original._retry = true

      const { refreshToken, setToken, logout } = useAuthStore.getState()
      if (!refreshToken) {
        logout()
        return Promise.reject(err)
      }

      try {
        const { data } = await axios.post(`${API_URL}/auth/refresh`, { refreshToken })
        setToken(data.accessToken)
        original.headers.Authorization = `Bearer ${data.accessToken}`
        return api(original)
      } catch {
        logout()
        return Promise.reject(err)
      }
    }

    return Promise.reject(err)
  },
)

export default api
