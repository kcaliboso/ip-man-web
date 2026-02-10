<template>
  <section class="flex-1 w-full flex flex-col justify-center items-center gap-2">
    <div class="text-center">
      <h1 class="text-2xl font-bold">Login</h1>
      <p class="mt-2 text-sm text-slate-200">Sign in to access your dashboard.</p>
    </div>

    <form class="mt-2 grid gap-4" @submit.prevent="handleLogin">
      <label class="grid gap-1">
        <span class="text-sm font-medium">Email</span>
        <input class="rounded border border-slate-300 px-3 py-2" type="email" required />
      </label>

      <label class="grid gap-1">
        <span class="text-sm font-medium">Password</span>
        <input class="rounded border border-slate-300 px-3 py-2" type="password" required />
      </label>

      <button
        class="rounded bg-slate-900 px-4 py-2 font-medium text-white hover:bg-slate-700"
        type="submit"
      >
        Login
      </button>
    </form>

    <div class="mt-6 flex flex-col items-center justify-between text-sm">
      <RouterLink class="underline" :to="{ name: 'forgot-password' }">Forgot password?</RouterLink>
      <RouterLink class="underline" :to="{ name: 'register' }">Create account</RouterLink>
    </div>
  </section>
</template>

<script setup lang="ts">
import { RouterLink, useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()

const handleLogin = () => {
  localStorage.setItem('auth_token', 'demo-token')
  const redirectTarget =
    typeof route.query.redirect === 'string' ? route.query.redirect : '/dashboard'
  router.push(redirectTarget)
}
</script>
