import { computed, ref, watch } from 'vue'
import { defineStore } from 'pinia'
import type { JwtPayload } from '@/types/JwtPayload'
import type { AuthUser } from '@/types/AuthUser'
import type { AuthSession } from '@/types/AuthSession'

const AUTH_SESSION_KEY = 'auth_session'

// Parse and sanitize persisted auth session payload from localStorage.
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

// Read auth session from localStorage. Falls back to an empty session when missing/invalid.
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

  return { token: '', user: null }
}

// Decode JWT payload segment (`header.payload.signature`) to inspect claims like `exp`.
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

// Validate token presence, structure, and expiration (if `exp` exists).
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
  // Single source of truth for persisted authentication state.
  const session = ref<AuthSession>(getStoredSession())

  watch(
    session,
    (nextSession) => {
      if (typeof window === 'undefined') {
        return
      }
      // Keep auth state persistent across page reloads.
      localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(nextSession))
    },
    { immediate: true },
  )

  // Convenience accessors for common auth checks.
  const token = computed(() => session.value.token)
  const user = computed(() => session.value.user)
  const isTokenValid = computed(() => isJwtTokenValid(token.value))
  const isAuthenticated = computed(() => isTokenValid.value)

  // Replace session in one call (used on login success).
  function setSession(nextSession: Partial<AuthSession>) {
    session.value = {
      token: nextSession.token ?? '',
      user: nextSession.user ?? null,
    }
  }

  // Update token while preserving current user data.
  function setToken(nextToken: string) {
    session.value = {
      ...session.value,
      token: nextToken,
    }
  }

  // Update user profile payload while preserving current token.
  function setUser(nextUser: AuthUser) {
    session.value = {
      ...session.value,
      user: nextUser,
    }
  }

  // Clear both token and user to fully logout client-side.
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
