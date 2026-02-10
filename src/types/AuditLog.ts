import type { User } from './User'

type Meta = {
  path: string
  method: string
  request_ip: string
  user_agent: string
}
type OldValues = Record<string, unknown> | null
type NewValues = Record<string, unknown> | null

export type AuditLog = {
  id: string
  event: string
  message: string
  ipAddress: string
  sessionId: string
  oldValues: OldValues
  newValues: NewValues
  meta: Meta
  createdAt: string
  user: User
}
