import type { IpAddress } from './IpAddress'
import type { User } from './User'

type Meta = {
  path: string
  method: string
  request_ip: string
  user_agent: string
}

type Values = {
  ip: string
  label: string
  comment: string
  user_id: string
}
type OldValues = Values | null
type NewValues = Values | null

export type AuditLog = {
  id: string
  event: string
  message: string
  ipAddress: string
  ipAddressRecord: IpAddress
  sessionId: string
  oldValues: OldValues
  newValues: NewValues
  meta: Meta
  createdAt: string
  user: User
}
