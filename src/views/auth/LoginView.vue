<template>
  <section class="mx-auto flex min-h-dvh w-full max-w-md flex-col justify-center px-4 py-10">
    <h1 class="text-3xl font-bold">Login</h1>
    <p class="mt-2 text-sm text-slate-600">Sign in to access your dashboard.</p>

    <form class="mt-8 grid gap-4" @submit.prevent="handleLogin">
      <label class="grid gap-1">
        <span class="text-sm font-medium">Email</span>
        <input class="rounded border border-slate-300 px-3 py-2" type="email" required />
      </label>

      <label class="grid gap-1">
        <span class="text-sm font-medium">Password</span>
        <input class="rounded border border-slate-300 px-3 py-2" type="password" required />
      </label>

      <button class="rounded bg-slate-900 px-4 py-2 font-medium text-white hover:bg-slate-700" type="submit">
        Login
      </button>
    </form>

    <div class="mt-6 flex justify-between text-sm">
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
  const redirectTarget = typeof route.query.redirect === 'string' ? route.query.redirect : '/dashboard'
  router.push(redirectTarget)
}
</script>
