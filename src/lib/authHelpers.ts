import type { AuthSession } from '@/types/AuthSession'
import type { AuthUser } from '@/types/AuthUser'
import type { JwtPayload } from '@/types/JwtPayload'
import { AxiosError } from 'axios'

export function getServerErrorMessage(error: unknown) {
  if (!(error instanceof AxiosError) || !error.response?.data) {
    return 'Login failed. Please try again.'
  }

  const data = error.response.data as {
    message?: string
    error?: string
    errors?: Record<string, string[]>
  }
  const fieldError = Object.values(data.errors ?? {})[0]?.[0]

  return fieldError ?? data.message ?? data.error ?? 'Login failed. Please try again.'
}

export function extractToken(data: unknown) {
  if (!data || typeof data !== 'object') {
    return ''
  }

  const payload = data as {
    token?: string
    access_token?: string
    data?: { token?: string; access_token?: string }
  }

  return (
    payload.access_token ?? payload.token ?? payload.data?.access_token ?? payload.data?.token ?? ''
  )
}

export function extractRefreshToken(data: unknown) {
  if (!data || typeof data !== 'object') {
    return ''
  }

  const payload = data as {
    refresh_token?: string
    refreshToken?: string
    data?: { refresh_token?: string; refreshToken?: string }
  }

  return (
    payload.refresh_token ??
    payload.refreshToken ??
    payload.data?.refresh_token ??
    payload.data?.refreshToken ??
    ''
  )
}

export function extractUser(data: unknown): Record<string, unknown> | null {
  if (!data || typeof data !== 'object') {
    return null
  }

  const payload = data as {
    user?: unknown
    data?: { user?: unknown }
  }

  if (payload.user && typeof payload.user === 'object' && !Array.isArray(payload.user)) {
    return payload.user as Record<string, unknown>
  }

  if (
    payload.data?.user &&
    typeof payload.data.user === 'object' &&
    !Array.isArray(payload.data.user)
  ) {
    return payload.data.user as Record<string, unknown>
  }

  return null
}

// Parse and sanitize persisted auth session payload from localStorage.
export function parseStoredSession(rawSession: string): AuthSession | null {
  try {
    const parsed = JSON.parse(rawSession) as Partial<AuthSession>
    const token = typeof parsed.token === 'string' ? parsed.token : ''
    const refreshToken = typeof parsed.refreshToken === 'string' ? parsed.refreshToken : ''
    const user =
      parsed.user && typeof parsed.user === 'object' && !Array.isArray(parsed.user)
        ? (parsed.user as AuthUser)
        : null

    return { token, refreshToken, user }
  } catch {
    return null
  }
}

// Read auth session from localStorage. Falls back to an empty session when missing/invalid.
export function getStoredSession(itemName: string): AuthSession {
  if (typeof window === 'undefined') {
    return { token: '', refreshToken: '', user: null }
  }

  const rawSession = localStorage.getItem(itemName)
  if (rawSession) {
    const parsedSession = parseStoredSession(rawSession)
    if (parsedSession) {
      return parsedSession
    }
    localStorage.removeItem(itemName)
  }

  return { token: '', refreshToken: '', user: null }
}

// Decode JWT payload segment (`header.payload.signature`) to inspect claims like `exp`.
export function decodeJwtPayload(token: string): JwtPayload | null {
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
export function isJwtTokenValid(token: string) {
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
