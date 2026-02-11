import type { PaginationState, SortingState } from '@tanstack/vue-table'
import type { Ref } from 'vue'

type UseServerTableControlsOptions = {
  currentPage: Ref<number>
  perPage: Ref<number>
  sorting: Ref<SortingState>
  onChange: () => void | Promise<void>
}

function isSortingStateEqual(left: SortingState, right: SortingState) {
  if (left.length !== right.length) {
    return false
  }

  return left.every(
    (leftSort, index) => leftSort.id === right[index]?.id && leftSort.desc === right[index]?.desc,
  )
}

export function useServerTableControls({
  currentPage,
  perPage,
  sorting,
  onChange,
}: UseServerTableControlsOptions) {
  const handlePaginationChange = (next: PaginationState) => {
    const nextPage = next.pageIndex + 1
    const nextPerPage = next.pageSize

    if (nextPage === currentPage.value && nextPerPage === perPage.value) {
      return
    }

    currentPage.value = nextPage
    perPage.value = nextPerPage
    void onChange()
  }

  const handleSortingChange = (next: SortingState) => {
    if (isSortingStateEqual(sorting.value, next)) {
      return
    }

    sorting.value = next
    currentPage.value = 1
    void onChange()
  }

  return {
    handlePaginationChange,
    handleSortingChange,
  }
}
