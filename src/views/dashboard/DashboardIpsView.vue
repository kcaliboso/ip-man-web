<template>
  <DashboardSection>
    <h1 class="text-2xl font-semibold">IP Addresses</h1>

    <div
      class="min-h-0 flex-1 overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
    >
      <div v-if="isLoading" class="flex items-center justify-center h-full">
        <Spinner />
      </div>
      <div v-else-if="errorMessage" class="p-4 text-sm text-red-600 dark:text-red-400">
        {{ errorMessage }}
      </div>
      <div v-else-if="!ipAddresses.length" class="p-4 text-sm text-slate-500 dark:text-slate-300">
        No audit logs found.
      </div>
      <DataTable
        v-else
        :data="ipAddresses"
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
import DashboardSection from '@/components/sections/DashboardSection.vue'
import { useServerTableControls } from '@/composables/useServerTableControls'
import api from '@/lib/axios'
import { formatDate } from '@/lib/utils'
import type { IpAddress } from '@/types/IpAddress'
import type { PaginatedResponse } from '@/types/Response/PaginatedResponse'
import type { ColumnDef, SortingState } from '@tanstack/vue-table'
import { AxiosError } from 'axios'
import { onMounted, ref } from 'vue'
import DataTable from '@/components/ui/DataTable.vue'
import Spinner from '@/components/shared/Spinner.vue'

const ipAddresses = ref<IpAddress[]>([])
const isLoading = ref(true)
const errorMessage = ref('')
const currentPage = ref(1)
const perPage = ref(10)
const lastPage = ref(1)
const sorting = ref<SortingState>([{ id: 'createdAt', desc: true }])

const columns: ColumnDef<IpAddress>[] = [
  {
    accessorKey: 'createdAt',
    header: 'Date',
    enableSorting: true,
    sortingFn: 'datetime',
    cell: (info) => formatDate(info.getValue() as string | undefined),
  },
  {
    accessorKey: 'ip',
    header: 'IP Address',
    enableSorting: true,
    sortingFn: 'alphanumeric',
    cell: (info) => (info.getValue() as string | undefined) ?? '-',
  },
  {
    accessorKey: 'label',
    header: 'Label',
    enableSorting: false,
    cell: (info) => (info.getValue() as string | undefined) ?? '-',
  },
  {
    id: 'user',
    header: 'Created By',
    accessorFn: (row) => row.createdBy?.name ?? '-',
    enableSorting: false,
    cell: (info) => (info.getValue() as string | undefined) ?? '-',
  },
]

async function loadIpAddresses() {
  isLoading.value = true
  errorMessage.value = ''
  const activeSort = sorting.value[0]

  try {
    const { data: response } = await api.get<PaginatedResponse<IpAddress>>('/v1/ip-addresses', {
      params: {
        page: currentPage.value,
        perPage: perPage.value,
        sortBy: activeSort?.id,
        sortDirection: activeSort ? (activeSort.desc ? 'desc' : 'asc') : undefined,
      },
    })
    ipAddresses.value = response.data
    currentPage.value = response.meta.current_page
    perPage.value = response.meta.per_page
    lastPage.value = response.meta.last_page
  } catch (error) {
    if (error instanceof AxiosError) {
      const payload = error.response?.data as { message?: string; error?: string } | undefined
      errorMessage.value = payload?.message ?? payload?.error ?? 'Failed to fetch IP addresses.'
    } else {
      errorMessage.value = 'Failed to fetch IP addresses.'
    }
  } finally {
    isLoading.value = false
  }
}

const { handlePaginationChange, handleSortingChange } = useServerTableControls({
  currentPage,
  perPage,
  sorting,
  onChange: loadIpAddresses,
})

onMounted(loadIpAddresses)
</script>
