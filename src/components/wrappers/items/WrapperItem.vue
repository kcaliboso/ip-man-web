<template>
  <div class="grid gap-1">
    <p class="font-medium text-slate-900 dark:text-slate-500">{{ label }}</p>
    <p class="text-slate-900 dark:text-slate-100">{{ value || '-' }}</p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  value?: string
  label: string
}>()
</script>
