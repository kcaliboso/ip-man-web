<template>
  <RouterLink
    :class="
      cn(
        'rounded-md px-2 py-1 ',
        className,
        hoverStyle && 'hover:bg-slate-200 dark:hover:bg-slate-800',
      )
    "
    :to="{ name: linkName }"
    >{{ linkLabel }}</RouterLink
  >
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { cn } from '@/lib/utils'
withDefaults(
  defineProps<{
    linkName: string
    linkLabel: string
    className?: string
    hoverStyle?: boolean
  }>(),
  {
    hoverStyle: true,
  },
)
</script>
