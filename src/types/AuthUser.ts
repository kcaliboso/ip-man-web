import type { IpAddress } from './IpAddress'

export type AuthUser = {
  id: string
  name: string
  email: string
  ownedIps?: IpAddress[]
} | null
