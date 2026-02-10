<template>
  <section class="mx-auto flex min-h-dvh w-full max-w-md flex-col justify-center px-4 py-10">
    <h1 class="text-3xl font-bold">Register</h1>
    <p class="mt-2 text-sm text-slate-600">Create your account to get started.</p>

    <form class="mt-8 grid gap-4" @submit.prevent="handleRegister">
      <label class="grid gap-1">
        <span class="text-sm font-medium">Full name</span>
        <input class="rounded border border-slate-300 px-3 py-2" type="text" required />
      </label>

      <label class="grid gap-1">
        <span class="text-sm font-medium">Email</span>
        <input class="rounded border border-slate-300 px-3 py-2" type="email" required />
      </label>

      <label class="grid gap-1">
        <span class="text-sm font-medium">Password</span>
        <input class="rounded border border-slate-300 px-3 py-2" type="password" minlength="8" required />
      </label>

      <button class="rounded bg-slate-900 px-4 py-2 font-medium text-white hover:bg-slate-700" type="submit">
        Create account
      </button>
    </form>

    <RouterLink class="mt-6 text-sm underline" :to="{ name: 'login' }">Already have an account?</RouterLink>
  </section>
</template>

<script setup lang="ts">
import { RouterLink, useRouter } from 'vue-router'

const router = useRouter()

const handleRegister = () => {
  router.push({ name: 'login' })
}
</script>
