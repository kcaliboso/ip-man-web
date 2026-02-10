<template>
  <button
    :class="
      cn(
        'rounded bg-slate-900 px-4 py-2 font-medium text-white hover:bg-slate-800 dark:hover:bg-slate-700 cursor-pointer',
        className,
      )
    "
    type="submit"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
import { cn } from '@/lib/utils'
withDefaults(defineProps<{ type?: 'submit' | 'button' | 'reset'; className?: string }>(), {
  className: '',
  type: 'button',
})
</script>
