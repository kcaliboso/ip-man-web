import type { User } from './User'

export type AuthSession = {
  token: string
  refreshToken: string
  user: User
}
