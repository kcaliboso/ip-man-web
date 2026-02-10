<template>
  <button
    :class="
      cn(
        'rounded text-black dark:text-white cursor-pointer',
        variant === 'solid' &&
          ' bg-slate-900 px-4 py-2 font-medium text-white hover:bg-slate-800 dark:hover:bg-slate-700 ',
        variant === 'link' && ' py-1 font-medium  ',
        variant === 'outline' &&
          '  px-3 py-1 font-medium  outline outline-slate-500 dark:hover:bg-slate-700 ',
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
