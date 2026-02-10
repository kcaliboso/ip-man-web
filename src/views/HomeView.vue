<template>
  <section
    class="mx-auto flex min-h-dvh w-full max-w-6xl flex-col justify-center items-center border"
  >
    <h1 class="text-5xl font-bold">Welcome to IP Man</h1>

    <div class="mt-8 grid gap-3">
      <RouterLink
        class="rounded bg-slate-900 px-4 py-2 text-center font-medium text-white hover:bg-slate-700"
        :to="{ name: 'login' }"
      >
        Go to Login
      </RouterLink>
      <RouterLink class="text-center text-sm text-slate-700 underline" :to="{ name: 'register' }">
        Create an account
      </RouterLink>
    </div>
  </section>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>
