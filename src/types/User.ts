import type { AuditLog } from './AuditLog'
import type { IpAddress } from './IpAddress'

export type User = {
  id: string
  name: string
  email: string
  email_verified_at: string
  createdAt: string
  updated_at: string
  ownedIps: IpAddress[]
  auditLogs: AuditLog[]
} | null
