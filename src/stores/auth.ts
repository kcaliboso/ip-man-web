import { computed, ref, watch } from 'vue'
import { defineStore } from 'pinia'
import type { JwtPayload } from '@/types/JwtPayload'
import type { AuthUser } from '@/types/AuthUser'
import type { AuthSession } from '@/types/AuthSession'

const AUTH_SESSION_KEY = 'auth_session'
const LEGACY_AUTH_TOKEN_KEY = 'auth_token'
const LEGACY_AUTH_USER_KEY = 'auth_user'

function parseStoredSession(rawSession: string): AuthSession | null {
  try {
    const parsed = JSON.parse(rawSession) as Partial<AuthSession>
    const token = typeof parsed.token === 'string' ? parsed.token : ''
    const user =
      parsed.user && typeof parsed.user === 'object' && !Array.isArray(parsed.user)
        ? (parsed.user as Record<string, unknown>)
        : null

    return { token, user }
  } catch {
    return null
  }
}

function getStoredSession(): AuthSession {
  if (typeof window === 'undefined') {
    return { token: '', user: null }
  }

  const rawSession = localStorage.getItem(AUTH_SESSION_KEY)
  if (rawSession) {
    const parsedSession = parseStoredSession(rawSession)
    if (parsedSession) {
      return parsedSession
    }
    localStorage.removeItem(AUTH_SESSION_KEY)
  }

  // One-time legacy migration from separate keys.
  const legacyToken = localStorage.getItem(LEGACY_AUTH_TOKEN_KEY) ?? ''
  const legacyUserRaw = localStorage.getItem(LEGACY_AUTH_USER_KEY)
  let legacyUser: AuthUser = null

  if (legacyUserRaw) {
    try {
      const parsedUser = JSON.parse(legacyUserRaw)
      if (parsedUser && typeof parsedUser === 'object' && !Array.isArray(parsedUser)) {
        legacyUser = parsedUser as Record<string, unknown>
      }
    } catch {
      // ignore malformed legacy user payload
    }
  }

  localStorage.removeItem(LEGACY_AUTH_TOKEN_KEY)
  localStorage.removeItem(LEGACY_AUTH_USER_KEY)

  return { token: legacyToken, user: legacyUser }
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
  const session = ref<AuthSession>(getStoredSession())

  watch(
    session,
    (nextSession) => {
      if (typeof window === 'undefined') {
        return
      }
      localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(nextSession))
    },
    { immediate: true },
  )

  const token = computed(() => session.value.token)
  const user = computed(() => session.value.user)
  const isTokenValid = computed(() => isJwtTokenValid(token.value))
  const isAuthenticated = computed(() => isTokenValid.value)

  function setSession(nextSession: Partial<AuthSession>) {
    session.value = {
      token: nextSession.token ?? '',
      user: nextSession.user ?? null,
    }
  }

  function setToken(nextToken: string) {
    session.value = {
      ...session.value,
      token: nextToken,
    }
  }

  function setUser(nextUser: AuthUser) {
    session.value = {
      ...session.value,
      user: nextUser,
    }
  }

  function clearToken() {
    session.value = {
      token: '',
      user: null,
    }
  }

  return {
    session,
    user,
    token,
    isTokenValid,
    isAuthenticated,
    setSession,
    setUser,
    setToken,
    clearToken,
  }
})
