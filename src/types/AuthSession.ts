import type { AuthUser } from './AuthUser'

export type AuthSession = {
  token: string
  user: AuthUser
}
