import type { AuthUser } from './AuthUser'

export type IpAddress = {
  id: string
  ip: string
  label: string
  comment: string
  createdAt: string
  updatedAt: string
  createdBy: AuthUser
}
