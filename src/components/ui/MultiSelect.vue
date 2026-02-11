<template>
  <div ref="rootRef" class="relative w-full max-w-md z-0">
    <!-- Input Wrapper -->
    <div
      class="flex flex-wrap items-center gap-2 border border-slate-300 rounded-md px-3 py-2 bg-slate-50 dark:bg-slate-900 cursor-text"
      @click="isOpen = true"
    >
      <!-- Tags -->
      <span
        v-for="option in selected"
        :key="option.value"
        class="flex items-center gap-1 bg-blue-100 text-blue-700 px-2 py-1 rounded text-sm"
      >
        {{ option.label }}
        <button class="hover:text-red-500" @click.stop="removeOption(option)">×</button>
      </span>

      <!-- Input -->
      <input
        v-model="search"
        :placeholder="selected.length ? '' : placeholder"
        class="flex-1 outline-none min-w-25 text-sm"
        @focus="isOpen = true"
      />
    </div>

    <!-- Dropdown -->
    <ul
      v-if="isOpen && (filteredOptions.length || creatable)"
      class="absolute z-10 mt-1 w-full bg-slate-50 dark:bg-slate-900 border rounded-md shadow-lg max-h-60 overflow-auto"
    >
      <li
        v-for="(option, index) in filteredOptions"
        :key="option.value"
        @click="selectOption(option)"
        class="px-3 py-2 cursor-pointer text-sm"
        :class="{
          'bg-blue-500 text-white dark:text-black': index === highlightedIndex,
          'hover:bg-gray-100 dark:hover:bg-slate-800': index !== highlightedIndex,
        }"
      >
        {{ option.label }}
      </li>

      <!-- Creatable Option -->
      <li
        v-if="creatable && search && !filteredOptions.length"
        @click="createTag"
        class="px-3 py-2 cursor-pointer text-sm text-blue-600 hover:bg-gray-100"
      >
        Create "{{ search }}"
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, type Ref } from 'vue'

export interface SelectOption {
  label: string
  value: string | number
}

interface Props {
  modelValue: SelectOption[]
  options: SelectOption[]
  placeholder?: string
  creatable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Select...',
  creatable: false,
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: SelectOption[]): void
  (e: 'cleared'): void
}>()

const isOpen = ref(false)
const search = ref('')
const highlightedIndex = ref<number>(-1)
const rootRef: Ref<HTMLElement | null> = ref(null)

const selected = computed(() => props.modelValue)

function setSelected(val: SelectOption[]) {
  const hadSelections = selected.value.length > 0
  emit('update:modelValue', val)
  if (hadSelections && val.length === 0) {
    emit('cleared')
  }
}

const filteredOptions = computed(() => {
  const query = search.value.toLowerCase()

  return props.options.filter(
    (option) =>
      option.label.toLowerCase().includes(query) &&
      !selected.value.some((sel) => sel.value === option.value),
  )
})

function selectOption(option: SelectOption) {
  setSelected([...selected.value, option])
  search.value = ''
  highlightedIndex.value = -1
}

function removeOption(option: SelectOption) {
  setSelected(selected.value.filter((sel) => sel.value !== option.value))
}

function createTag() {
  if (!props.creatable) return
  if (!search.value.trim()) return

  const newOption: SelectOption = {
    label: search.value,
    value: search.value,
  }

  setSelected([...selected.value, newOption])
  search.value = ''
}

function handleClickOutside(e: MouseEvent) {
  if (rootRef.value && !rootRef.value.contains(e.target as Node)) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
