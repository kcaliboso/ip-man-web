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
