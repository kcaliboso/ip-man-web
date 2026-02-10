<template>
  <RouterLink class="rounded-md hover:bg-slate-200 px-2 py-1" :to="{ name: linkName }">{{
    linkLabel
  }}</RouterLink>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
defineProps<{
  linkName: string
  linkLabel: string
}>()
</script>
