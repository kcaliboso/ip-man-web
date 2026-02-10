import type { User } from './User'

export type IpAddress = {
  id: string
  ip: string
  label: string
  comment: string
  createdAt: string
  updatedAt: string
  createdBy: User
}
