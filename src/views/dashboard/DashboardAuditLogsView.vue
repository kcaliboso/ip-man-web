<template>
  <DashboardSection>
    <h1 class="text-2xl font-semibold">Audit logs</h1>

    <div
      class="min-h-0 flex-1 overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
    >
      <div v-if="isLoading" class="p-4 text-sm text-slate-500 dark:text-slate-300">
        Loading audit logs...
      </div>
      <div v-else-if="errorMessage" class="p-4 text-sm text-red-600 dark:text-red-400">
        {{ errorMessage }}
      </div>
      <div v-else-if="!auditLogs.length" class="p-4 text-sm text-slate-500 dark:text-slate-300">
        No audit logs found.
      </div>
      <div v-else class="h-full overflow-auto">
        <table class="min-w-full border-collapse text-sm">
          <thead class="sticky top-0 bg-slate-100 text-left dark:bg-slate-800">
            <tr>
              <th class="px-4 py-3 font-semibold">Date</th>
              <th class="px-4 py-3 font-semibold">Event</th>
              <th class="px-4 py-3 font-semibold">User</th>
              <th class="px-4 py-3 font-semibold">IP</th>
              <th class="px-4 py-3 font-semibold">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="log in auditLogs"
              :key="String(log.id)"
              class="border-t border-slate-200 dark:border-slate-800"
            >
              <td class="px-4 py-3 whitespace-nowrap">
                {{ formatDate(log.createdAt) }}
              </td>
              <td class="px-4 py-3">{{ log.event ?? '-' }}</td>
              <td class="px-4 py-3">{{ log.user?.name ?? '-' }}</td>
              <td class="px-4 py-3">{{ log.ipAddress ?? '-' }}</td>
              <td class="px-4 py-3">{{ log.message ?? '-' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </DashboardSection>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { AxiosError } from 'axios'
import DashboardSection from '@/components/sections/DashboardSection.vue'
import api from '@/lib/axios'
import type { AuditLog } from '@/types/AuditLog'

const auditLogs = ref<AuditLog[]>([])
const isLoading = ref(true)
const errorMessage = ref('')

const formatDate = (value?: string) => {
  if (!value) {
    return '-'
  }

  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) {
    return value
  }

  return parsed.toLocaleString()
}

const loadAuditLogs = async () => {
  isLoading.value = true
  errorMessage.value = ''

  try {
    const { data: response } = await api.get('/v1/audit-logs')
    auditLogs.value = response.data
  } catch (error) {
    if (error instanceof AxiosError) {
      const payload = error.response?.data as { message?: string; error?: string } | undefined
      errorMessage.value = payload?.message ?? payload?.error ?? 'Failed to fetch audit logs.'
    } else {
      errorMessage.value = 'Failed to fetch audit logs.'
    }
  } finally {
    isLoading.value = false
  }
}

onMounted(loadAuditLogs)
</script>
