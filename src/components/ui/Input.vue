<template>
  <div class="grid gap-1">
    <label v-if="label" :for="inputId" class="text-sm font-medium">
      {{ label }}
    </label>

    <input
      :id="inputId"
      v-model="model"
      :type="type"
      :class="[
        'rounded-lg border px-3 py-2 outline-none transition-colors dark:bg-slate-900 dark:text-slate-100',
        error
          ? 'border-rose-500 focus:border-rose-500 dark:border-rose-500 dark:focus:border-rose-500'
          : 'border-slate-300 focus:border-slate-500 dark:border-slate-700 dark:focus:border-slate-500',
      ]"
      :aria-invalid="Boolean(error)"
      :aria-describedby="error ? errorId : undefined"
      v-bind="attrs"
    />

    <p v-if="error" :id="errorId" class="text-xs text-rose-600 dark:text-rose-400">
      {{ error }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed, getCurrentInstance, useAttrs } from 'vue'

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(
  defineProps<{
    id?: string
    label?: string
    type?: string
    error?: string
  }>(),
  {
    id: undefined,
    label: undefined,
    type: 'text',
    error: '',
  },
)

const model = defineModel<string | number>()
const attrs = useAttrs()
const instance = getCurrentInstance()
const fallbackId = `input-${instance?.uid ?? 'field'}`

const inputId = computed(() => props.id ?? fallbackId)
const errorId = computed(() => `${inputId.value}-error`)
const error = computed(() => props.error)
</script>
