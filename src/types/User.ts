import type { AuditLog } from './AuditLog'
import type { IpAddress } from './IpAddress'
import type { Role } from './Enums/Role'

export type User = {
  id: string
  name: string
  email: string
  role: Role
  email_verified_at: string
  createdAt: string
  updated_at: string
  ownedIps: IpAddress[]
} | null
