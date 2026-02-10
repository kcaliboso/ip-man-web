import type { User } from '../User'

export type AuthResponse = {
  message: string
  user?: User
  token_type: string
  access_token: string
  refresh_token: string
  expires_in: number
  expires_at: string
}
