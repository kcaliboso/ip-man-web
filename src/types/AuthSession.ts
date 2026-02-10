import type { AuthUser } from './AuthUser'

export type AuthSession = {
  token: string
  refreshToken: string
  user: AuthUser
}
