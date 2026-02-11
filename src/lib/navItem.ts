import {
  XMarkIcon,
  Squares2X2Icon,
  ClipboardDocumentListIcon,
  DocumentDuplicateIcon,
} from '@heroicons/vue/24/solid'

export const adminNavs = [
  { name: 'dashboard', label: 'Dashboard', icon: Squares2X2Icon },
  { name: 'audit-logs', label: 'Audit Logs', icon: ClipboardDocumentListIcon },
  { name: 'ip-addresses', label: 'IP Addresses', icon: DocumentDuplicateIcon },
]

export const clientNavs = [
  { name: 'dashboard', label: 'Dashboard', icon: Squares2X2Icon },
  { name: 'ip-addresses', label: 'IP Addresses', icon: DocumentDuplicateIcon },
  { name: 'my-audit-logs', label: 'My Audit Logs', icon: ClipboardDocumentListIcon },
]
