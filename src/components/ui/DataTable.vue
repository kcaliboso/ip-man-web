<template>
  <div class="flex h-full min-h-0 flex-col">
    <div class="min-h-0 flex-1 overflow-auto">
      <table class="min-w-full border-collapse text-sm">
        <thead class="sticky top-0 bg-slate-100 text-left dark:bg-slate-950">
          <tr v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
            <th
              v-for="header in headerGroup.headers"
              :key="header.id"
              class="px-4 py-3 font-semibold"
            >
              <template v-if="!header.isPlaceholder">
                <button
                  v-if="header.column.getCanSort()"
                  class="inline-flex items-center gap-1 select-none hover:text-slate-900 dark:hover:text-white cursor-pointer"
                  @click="header.column.toggleSorting(header.column.getIsSorted() === 'asc')"
                >
                  <FlexRender
                    :render="header.column.columnDef.header"
                    :props="header.getContext()"
                  />
                  <span class="text-xs text-slate-500 dark:text-slate-400">
                    {{ getSortIndicator(header.column.getIsSorted()) }}
                  </span>
                </button>
                <FlexRender
                  v-else
                  :render="header.column.columnDef.header"
                  :props="header.getContext()"
                />
              </template>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="row in table.getRowModel().rows"
            :key="row.id"
            class="border-t border-slate-200 dark:border-slate-800 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-950"
          >
            <td v-for="cell in row.getVisibleCells()" :key="cell.id" class="px-4 py-3">
              <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div
      class="flex items-center justify-between border-t border-slate-200 px-4 py-3 text-sm dark:border-slate-800"
    >
      <div class="flex items-center gap-2">
        <span>Rows per page</span>
        <select
          class="rounded border border-slate-300 bg-white px-2 py-1 dark:border-slate-700 dark:bg-slate-900"
          :value="table.getState().pagination.pageSize"
          @change="table.setPageSize(Number(($event.target as HTMLSelectElement).value))"
        >
          <option :value="5">5</option>
          <option :value="10">10</option>
          <option :value="20">20</option>
          <option :value="50">50</option>
        </select>
      </div>

      <div class="flex items-center gap-3">
        <span
          >Page {{ table.getState().pagination.pageIndex + 1 }} of {{ table.getPageCount() }}</span
        >
        <button
          class="rounded border border-slate-300 px-2 py-1 disabled:opacity-40 dark:border-slate-700"
          :disabled="!table.getCanPreviousPage()"
          @click="table.previousPage()"
        >
          Previous
        </button>
        <button
          class="rounded border border-slate-300 px-2 py-1 disabled:opacity-40 dark:border-slate-700"
          :disabled="!table.getCanNextPage()"
          @click="table.nextPage()"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, type PropType } from 'vue'
import {
  FlexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type Column,
  useVueTable,
  type ColumnDef,
  type PaginationState,
  type SortingState,
  type Updater,
} from '@tanstack/vue-table'

const emit = defineEmits<{
  paginationChange: [value: PaginationState]
  sortingChange: [value: SortingState]
}>()

const props = defineProps({
  data: {
    type: Array as PropType<any[]>,
    required: true,
  },
  columns: {
    type: Array as PropType<ColumnDef<any>[]>,
    required: true,
  },
  manualPagination: {
    type: Boolean,
    default: false,
  },
  manualSorting: {
    type: Boolean,
    default: false,
  },
  pageIndex: {
    type: Number,
    default: 0,
  },
  pageSize: {
    type: Number,
    default: 10,
  },
  pageCount: {
    type: Number,
    default: undefined,
  },
  initialSorting: {
    type: Array as PropType<SortingState>,
    default: () => [],
  },
  sorting: {
    type: Array as PropType<SortingState>,
    default: undefined,
  },
})

const tableData = computed(() => props.data)
const pagination = ref<PaginationState>({
  pageIndex: 0,
  pageSize: 10,
})
const sorting = ref<SortingState>(props.initialSorting)

const onPaginationChange = (updater: Updater<PaginationState>) => {
  if (props.manualPagination) {
    const next = updater instanceof Function ? updater(externalPagination.value) : updater
    emit('paginationChange', next)
    return
  }

  pagination.value = updater instanceof Function ? updater(pagination.value) : updater
  emit('paginationChange', pagination.value)
}

const onSortingChange = (updater: Updater<SortingState>) => {
  const current = props.sorting ?? sorting.value
  const next = updater instanceof Function ? updater(current) : updater

  if (props.manualSorting) {
    emit('sortingChange', next)
    return
  }

  sorting.value = next
  emit('sortingChange', next)
}

const externalPagination = computed<PaginationState>(() => ({
  pageIndex: props.pageIndex,
  pageSize: props.pageSize,
}))

const getSortIndicator = (sorted: ReturnType<Column<any>['getIsSorted']>) => {
  if (sorted === 'asc') {
    return '▲'
  }
  if (sorted === 'desc') {
    return '▼'
  }
  return '↕'
}

const table = useVueTable({
  get data() {
    return tableData.value
  },
  get columns() {
    return props.columns
  },
  get pageCount() {
    return props.pageCount
  },
  manualPagination: props.manualPagination,
  manualSorting: props.manualSorting,
  getCoreRowModel: getCoreRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  getSortedRowModel: props.manualSorting ? undefined : getSortedRowModel(),
  onPaginationChange,
  onSortingChange,
  state: {
    get pagination() {
      return props.manualPagination ? externalPagination.value : pagination.value
    },
    get sorting() {
      return props.sorting ?? sorting.value
    },
  },
})
</script>
