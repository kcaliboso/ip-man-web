import { computed, ref, watch } from 'vue'
import { defineStore } from 'pinia'

const AUTH_TOKEN_KEY = 'auth_token'

type JwtPayload = {
  exp?: number
}

function getStoredToken() {
  if (typeof window === 'undefined') {
    return ''
  }

  return localStorage.getItem(AUTH_TOKEN_KEY) ?? ''
}

function decodeJwtPayload(token: string): JwtPayload | null {
  try {
    const parts = token.split('.')
    const payloadSegment = parts.length === 3 ? parts[1] : undefined

    if (!payloadSegment) {
      return null
    }

    const base64 = payloadSegment.replace(/-/g, '+').replace(/_/g, '/')
    const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=')
    const json = atob(padded)
    return JSON.parse(json) as JwtPayload
  } catch {
    return null
  }
}

function isJwtTokenValid(token: string) {
  if (!token) {
    return false
  }

  const payload = decodeJwtPayload(token)
  if (!payload) {
    return false
  }

  if (typeof payload.exp !== 'number') {
    return true
  }

  return payload.exp > Math.floor(Date.now() / 1000)
}

export const useAuthStore = defineStore('auth', () => {
  const token = ref(getStoredToken())
  const user = ref([])

  watch(
    token,
    (nextToken) => {
      if (typeof window === 'undefined') {
        return
      }

      if (nextToken) {
        localStorage.setItem(AUTH_TOKEN_KEY, nextToken)
        return
      }

      localStorage.removeItem(AUTH_TOKEN_KEY)
    },
    { immediate: true },
  )

  const isTokenValid = computed(() => isJwtTokenValid(token.value))
  const isAuthenticated = computed(() => isTokenValid.value)

  function setUser() {
    //
  }

  function setToken(nextToken: string) {
    token.value = nextToken
  }

  function clearToken() {
    token.value = ''
  }

  return {
    user,
    token,
    isTokenValid,
    isAuthenticated,
    setToken,
    clearToken,
  }
})
