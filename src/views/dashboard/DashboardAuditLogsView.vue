<template>
  <DashboardSection>
    <div class="w-full flex justify-between items-center cursor">
      <h1 class="text-2xl font-semibold">Audit logs</h1>
      <div class="flex items-center gap-3">
        <MultiSelect
          v-model="selectedEvents"
          :options="events"
          placeholder="Select Events"
          @cleared="handleFilterClear"
        />
        <Button
          class-name="rounded-lg disabled:cursor-not-allowed"
          :disabled="!selectedEvents.length"
          @click="handleFilter"
          >Filter</Button
        >
      </div>
    </div>

    <div
      class="min-h-0 flex-1 overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
    >
      <div v-if="isLoading" class="flex items-center justify-center h-full">
        <Spinner />
      </div>
      <div v-else-if="errorMessage" class="p-4 text-sm text-red-600 dark:text-red-400">
        {{ errorMessage }}
      </div>
      <div v-else-if="!auditLogs.length" class="p-4 text-sm text-slate-500 dark:text-slate-300">
        No audit logs found.
      </div>
      <DataTable
        v-else
        :data="auditLogs"
        :columns="columns"
        :manual-pagination="true"
        :manual-sorting="true"
        :sorting="sorting"
        :page-index="currentPage - 1"
        :page-size="perPage"
        :page-count="lastPage"
        @pagination-change="handlePaginationChange"
        @sorting-change="handleSortingChange"
      />
    </div>
  </DashboardSection>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { AxiosError } from 'axios'
import type { ColumnDef, SortingState } from '@tanstack/vue-table'
import DashboardSection from '@/components/sections/DashboardSection.vue'
import DataTable from '@/components/ui/DataTable.vue'
import api from '@/lib/axios'
import type { AuditLog } from '@/types/AuditLog'
import type { PaginatedResponse } from '@/types/Response/PaginatedResponse'
import Spinner from '@/components/shared/Spinner.vue'
import { formatDate } from '@/lib/utils'
import { useServerTableControls } from '@/composables/useServerTableControls'
import { useAuthStore } from '@/stores/auth'
import { Role } from '@/types/Enums/Role'
import { AuditEvent, AuditEventLabels } from '@/types/Enums/AuditEvent'
import MultiSelect, { type SelectOption } from '@/components/ui/MultiSelect.vue'
import Button from '@/components/ui/Button.vue'

const auditLogs = ref<AuditLog[]>([])
const isLoading = ref(true)
const errorMessage = ref('')
const currentPage = ref(1)
const perPage = ref(10)
const lastPage = ref(1)
const sorting = ref<SortingState>([{ id: 'createdAt', desc: true }])
const authStore = useAuthStore()
const selectedEvents = ref<SelectOption[]>([])
const events = ref<SelectOption[]>(
  Object.values(AuditEvent).map((value) => ({
    label: AuditEventLabels[value],
    value,
  })),
)

const columns: ColumnDef<AuditLog>[] = [
  {
    accessorKey: 'createdAt',
    header: 'Date',
    enableSorting: true,
    sortingFn: 'datetime',
    cell: (info) => formatDate(info.getValue() as string | undefined),
  },
  {
    accessorKey: 'event',
    header: 'Event',
    enableSorting: true,
    sortingFn: 'alphanumeric',
    cell: (info) => (info.getValue() as string | undefined) ?? '-',
  },
  {
    id: 'user',
    header: 'User',
    accessorFn: (row) => row.user?.name ?? '-',
    enableSorting: false,
    cell: (info) => (info.getValue() as string | undefined) ?? '-',
  },
  {
    id: 'ipAddress',
    header: 'IP',
    accessorFn: (row) =>
      typeof row.ipAddress === 'string' ? row.ipAddress : (row.ipAddress?.ip ?? '-'),
    enableSorting: false,
    cell: (info) => (info.getValue() as string | undefined) ?? '-',
  },
  {
    accessorKey: 'message',
    header: 'message',
    enableSorting: false,
    cell: (info) => (info.getValue() as string | undefined) ?? '-',
  },
]

async function loadAuditLogs() {
  isLoading.value = true
  errorMessage.value = ''
  const activeSort = sorting.value[0]

  try {
    const auditEndpoint = authStore.user?.role === Role.Admin ? 'audit-logs' : 'my-audit-logs'
    const { data: response } = await api.get<PaginatedResponse<AuditLog>>(`/v1/${auditEndpoint}`, {
      params: {
        page: currentPage.value,
        perPage: perPage.value,
        sortBy: activeSort?.id,
        sortDirection: activeSort ? (activeSort.desc ? 'desc' : 'asc') : undefined,
        event: selectedEvents.value.map((option) => option.value),
      },
    })
    auditLogs.value = response.data
    currentPage.value = response.meta.current_page
    perPage.value = response.meta.per_page
    lastPage.value = response.meta.last_page
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

function handleFilterClear() {
  currentPage.value = 1
  loadAuditLogs()
}

function handleFilter() {
  currentPage.value = 1
  loadAuditLogs()
}

const { handlePaginationChange, handleSortingChange } = useServerTableControls({
  currentPage,
  perPage,
  sorting,
  onChange: loadAuditLogs,
})

onMounted(loadAuditLogs)
</script>
