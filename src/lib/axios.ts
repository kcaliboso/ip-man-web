import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios'
import { extractRefreshToken, extractToken, extractUser } from '@/lib/authHelpers'
import { useAuthStore } from '@/stores/auth'
import { pinia } from '@/stores'

type RetriableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

if (!import.meta.env.VITE_API_URL && import.meta.env.DEV) {
  console.warn('[api] Missing VITE_API_URL. Requests will use the current origin.')
}

let refreshPromise: Promise<string | null> | null = null

const refreshAccessToken = async () => {
  if (refreshPromise) {
    return refreshPromise
  }

  const authStore = useAuthStore(pinia)

  refreshPromise = (async () => {
    if (!authStore.refreshToken) {
      authStore.clearToken()
      return null
    }

    try {
      const response = await axios.post(
        '/auth/refresh',
        {
          refresh_token: authStore.refreshToken,
        },
        {
          baseURL: import.meta.env.VITE_API_URL,
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )

      const nextAccessToken = extractToken(response.data)
      if (!nextAccessToken) {
        authStore.clearToken()
        return null
      }

      authStore.setSession({
        token: nextAccessToken,
        refreshToken: extractRefreshToken(response.data) || authStore.refreshToken,
        user: extractUser(response.data) ?? authStore.user,
      })

      return nextAccessToken
    } catch {
      authStore.clearToken()
      return null
    } finally {
      refreshPromise = null
    }
  })()

  return refreshPromise
}

api.interceptors.request.use((config) => {
  const authStore = useAuthStore(pinia)

  if (authStore.token && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${authStore.token}`
  }

  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetriableRequestConfig | undefined

    if (!originalRequest) {
      return Promise.reject(error)
    }

    const status = error.response?.status
    const requestUrl = originalRequest.url ?? ''
    const isAuthRoute = requestUrl.includes('/auth/login') || requestUrl.includes('/auth/refresh')

    if (status !== 401 || originalRequest._retry || isAuthRoute) {
      return Promise.reject(error)
    }

    originalRequest._retry = true

    const nextAccessToken = await refreshAccessToken()

    if (!nextAccessToken) {
      return Promise.reject(error)
    }

    originalRequest.headers.Authorization = `Bearer ${nextAccessToken}`
    return api(originalRequest)
  },
)

export default api
