import type { IpAddress } from './IpAddress'

export type DashboardMetricsData = {
  ip_addresses_count: number
  audit_logs_count: number
  recent_ip_addresses: IpAddress[]
}

export type DashboardMetricsResponse = {
  message: string
  data: DashboardMetricsData
}
