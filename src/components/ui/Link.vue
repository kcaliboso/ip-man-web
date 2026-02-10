<template>
  <RouterLink
    :class="cn('rounded-md px-2 py-1 hover:bg-slate-200 dark:hover:bg-slate-800', className)"
    :to="{ name: linkName }"
    >{{ linkLabel }}</RouterLink
  >
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { cn } from '@/lib/utils'
defineProps<{
  linkName: string
  linkLabel: string
  className?: string
}>()
</script>
