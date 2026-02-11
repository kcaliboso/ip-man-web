<template>
  <button
    :class="
      cn(
        'rounded font-medium text-black dark:text-white cursor-pointer px-4 py-2 ',
        variant === 'solid' &&
          ' bg-slate-900 text-white hover:bg-slate-800 dark:hover:bg-slate-700 ',
        variant === 'outline' && 'outline outline-slate-500 dark:hover:bg-slate-700 ',
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
withDefaults(
  defineProps<{
    variant?: 'solid' | 'link' | 'outline'
    type?: 'submit' | 'button' | 'reset'
    className?: string
  }>(),
  {
    className: '',
    type: 'button',
    variant: 'solid',
  },
)
</script>
