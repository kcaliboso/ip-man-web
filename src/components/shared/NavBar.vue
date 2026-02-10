<template>
  <header
    class="flex h-12 items-center justify-between rounded-lg bg-slate-100 px-6 text-slate-900 drop-shadow-sm dark:bg-slate-900 dark:text-slate-100"
  >
    <Link link-name="home" link-label="IPman" className="text-2xl font-bold" :hover-style="false" />

    <div class="flex items-center gap-3">
      <ThemeModeSwitcher />
      <Link v-show="authStore.token" link-name="dashboard" link-label="Dashboard" />
      <Link v-show="!authStore.token" link-name="login" link-label="Login" />
    </div>
  </header>
</template>

<script setup lang="ts">
import ThemeModeSwitcher from './ThemeModeSwitcher.vue'
import Link from '../ui/Link.vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
</script>
