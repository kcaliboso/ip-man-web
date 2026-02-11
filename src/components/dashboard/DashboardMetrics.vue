<template>
  <div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
    <article
      v-for="card in statsCards"
      :key="card.label"
      class="rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800"
    >
      <p class="text-sm text-slate-500 dark:text-slate-400">{{ card.label }}</p>
      <Spinner v-if="isLoading" />
      <p v-else class="mt-2 text-2xl font-semibold">{{ card.value }}</p>
    </article>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUpdated, ref } from 'vue'
import { AxiosError } from 'axios'
import api from '@/lib/axios'
import type { DashboardMetricsData, DashboardMetricsResponse } from '@/types/DashboardMetrics'
import Spinner from '../shared/Spinner.vue'

const metrics = ref<DashboardMetricsData | null>(null)
const isLoading = ref(true)

const emits = defineEmits(['updated'])

const getErrorMessage = (error: unknown) => {
  if (!(error instanceof AxiosError) || !error.response?.data) {
    return 'Failed to fetch dashboard metrics.'
  }

  const payload = error.response.data as { message?: string; error?: string }
  return payload.message ?? payload.error ?? 'Failed to fetch dashboard metrics.'
}

const loadMetrics = async () => {
  isLoading.value = true
  try {
    const response = await api.get<DashboardMetricsResponse>('/v1/dashboard')
    metrics.value = response.data.data
  } catch (error) {
    console.error(getErrorMessage(error))
  } finally {
    isLoading.value = false
  }
}

const statsCards = computed(() => [
  {
    label: 'Recorded IP Address',
    value: (metrics.value?.ip_addresses_count ?? 0).toLocaleString(),
  },
  {
    label: 'Audit Logs',
    value: (metrics.value?.audit_logs_count ?? 0).toLocaleString(),
  },
])

onMounted(loadMetrics)
onUpdated(() => {
  emits('updated', metrics.value?.recent_ip_addresses)
})
</script>
