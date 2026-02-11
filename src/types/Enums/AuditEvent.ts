export enum AuditEvent {
  IpCreated = 'ip_address.created',
  IpUpdated = 'ip_address.updated',
  IpDeleted = 'ip_address.deleted',

  AuthLogin = 'auth.login',
  AuthRegister = 'auth.register',
  AuthLogout = 'auth.logout',
}

export const AuditEventLabels: Record<AuditEvent, string> = {
  [AuditEvent.IpCreated]: 'IP Created',
  [AuditEvent.IpUpdated]: 'IP Updated',
  [AuditEvent.IpDeleted]: 'IP Deleted',
  [AuditEvent.AuthLogin]: 'Auth Login',
  [AuditEvent.AuthRegister]: 'Auth Register',
  [AuditEvent.AuthLogout]: 'Auth Logout',
}
