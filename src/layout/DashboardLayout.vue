<template>
  <div class="min-h-dvh bg-slate-100 text-slate-900">
    <header class="border-b border-slate-200 bg-white">
      <div class="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <h1 class="text-lg font-semibold">Dashboard</h1>
        <button
          class="rounded bg-slate-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-slate-700"
          type="button"
          @click="logout"
        >
          Logout
        </button>
      </div>
    </header>

    <section class="mx-auto max-w-6xl px-4 py-6">
      <RouterView />
    </section>
  </div>
</template>

<script setup lang="ts">
import { RouterView, useRouter } from 'vue-router'

const router = useRouter()

const logout = () => {
  localStorage.removeItem('auth_token')
  router.push({ name: 'login' })
}
</script>
