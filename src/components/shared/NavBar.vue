<template>
  <nav class="px-6 h-12 flex justify-between items-center bg-slate-100 rounded-lg drop-shadow-sm">
    <RouterLink :to="{ name: 'home' }" class="font-bold text-2xl">IPman</RouterLink>
    <Link link-name="login" link-label="Login" />
  </nav>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import Link from '../ui/Link.vue'
</script>
