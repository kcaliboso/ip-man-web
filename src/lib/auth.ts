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
