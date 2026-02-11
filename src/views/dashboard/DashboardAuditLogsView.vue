<template>
  <DashboardSection>
    <h1 class="text-2xl font-semibold">Audit logs</h1>

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
import type { ColumnDef, PaginationState, SortingState } from '@tanstack/vue-table'
import DashboardSection from '@/components/sections/DashboardSection.vue'
import DataTable from '@/components/ui/DataTable.vue'
import api from '@/lib/axios'
import type { AuditLog } from '@/types/AuditLog'
import type { PaginatedResponse } from '@/types/Response/PaginatedResponse'
import Spinner from '@/components/shared/Spinner.vue'

const auditLogs = ref<AuditLog[]>([])
const isLoading = ref(true)
const errorMessage = ref('')
const currentPage = ref(1)
const perPage = ref(10)
const lastPage = ref(1)
const sorting = ref<SortingState>([{ id: 'createdAt', desc: true }])

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
    accessorKey: 'ipAddress',
    header: 'IP',
    enableSorting: false,
    cell: (info) => (info.getValue() as string | undefined) ?? '-',
  },
  {
    accessorKey: 'message',
    header: 'Action',
    enableSorting: false,
    cell: (info) => (info.getValue() as string | undefined) ?? '-',
  },
]

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
  const activeSort = sorting.value[0]

  try {
    const { data: response } = await api.get<PaginatedResponse<AuditLog>>('/v1/audit-logs', {
      params: {
        page: currentPage.value,
        perPage: perPage.value,
        sortBy: activeSort?.id,
        sortDirection: activeSort ? (activeSort.desc ? 'desc' : 'asc') : undefined,
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

const handlePaginationChange = (next: PaginationState) => {
  const nextPage = next.pageIndex + 1
  const nextPerPage = next.pageSize

  if (nextPage === currentPage.value && nextPerPage === perPage.value) {
    return
  }

  currentPage.value = nextPage
  perPage.value = nextPerPage
  loadAuditLogs()
}

const handleSortingChange = (next: SortingState) => {
  const [currentSort] = sorting.value
  const [nextSort] = next

  if (currentSort?.id === nextSort?.id && currentSort?.desc === nextSort?.desc) {
    return
  }

  sorting.value = next
  currentPage.value = 1
  loadAuditLogs()
}

onMounted(loadAuditLogs)
</script>
