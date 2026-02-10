<template>
  <section class="flex-1 w-full flex flex-col justify-center items-center gap-2">
    <h1 class="text-3xl font-bold">Register</h1>
    <p class="mt-2 text-sm text-slate-600 dark:text-slate-200">
      Create your account to get started.
    </p>

    <form class="mt-8 grid gap-4" @submit.prevent="handleRegister">
      <Input
        v-model="fullName"
        label="Full name"
        autocomplete="name"
        :error="errors.fullName"
        required
      />

      <Input
        v-model="email"
        label="Email"
        type="email"
        autocomplete="email"
        :error="errors.email"
        required
      />

      <Input
        v-model="password"
        label="Password"
        type="password"
        autocomplete="new-password"
        :error="errors.password"
        minlength="8"
        required
      />

      <Input
        v-model="passwordConfirmation"
        label="Password Confirmation"
        type="password"
        :error="errors.passwordConfirmation"
        minlength="8"
        required
      />

      <button
        class="rounded bg-slate-900 px-4 py-2 font-medium text-white hover:bg-slate-700"
        type="submit"
      >
        Create account
      </button>
    </form>

    <RouterLink class="mt-6 text-sm underline" :to="{ name: 'login' }"
      >Already have an account?</RouterLink
    >
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Input from '@/components/ui/Input.vue'
import { RouterLink, useRouter } from 'vue-router'
import { z } from 'zod'

const registerSchema = z
  .object({
    fullName: z.string().trim().min(2, 'Full name must be at least 2 characters.'),
    email: z.string().trim().email('Please enter a valid email address.'),
    password: z.string().min(8, 'Password must be at least 8 characters.'),
    passwordConfirmation: z.string().min(1, 'Password confirmation is required.'),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    path: ['passwordConfirmation'],
    message: 'Passwords do not match.',
  })

const fullName = ref('')
const email = ref('')
const password = ref('')
const passwordConfirmation = ref('')
const errors = ref<{
  fullName?: string
  email?: string
  password?: string
  passwordConfirmation?: string
}>({})

const router = useRouter()

const handleRegister = () => {
  errors.value = {}

  const result = registerSchema.safeParse({
    fullName: fullName.value,
    email: email.value,
    password: password.value,
    passwordConfirmation: passwordConfirmation.value,
  })

  if (!result.success) {
    const fieldErrors = z.treeifyError(result.error)
    errors.value = {
      fullName: fieldErrors.properties?.fullName?.errors?.[0],
      email: fieldErrors.properties?.email?.errors?.[0],
      password: fieldErrors.properties?.password?.errors?.[0],
      passwordConfirmation: fieldErrors.properties?.passwordConfirmation?.errors?.[0],
    }
    return
  }

  console.log(result)
}
</script>
