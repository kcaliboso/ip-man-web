<template>
  <section class="flex-1 w-full flex flex-col justify-center items-center gap-2">
    <h1 class="text-3xl font-bold">Forgot password</h1>
    <p class="mt-2 text-sm text-slate-600 dark:text-slate-200">
      Enter your email and we will send a reset link.
    </p>

    <form class="mt-8 grid gap-4" @submit.prevent="handleReset">
      <Input
        v-model="email"
        label="Email"
        type="email"
        autocomplete="email"
        :error="errors.email"
        required
      />

      <Button type="submit"> Send Reset Link </Button>
    </form>

    <RouterLink class="mt-6 text-sm underline" :to="{ name: 'login' }">Back to login</RouterLink>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Input from '@/components/ui/Input.vue'
import { RouterLink, useRouter } from 'vue-router'
import Button from '@/components/ui/Button.vue'
import { z } from 'zod'

const forgotPasswordSchema = z.object({
  email: z.string().trim().email('Please enter a valid email address.'),
})

const email = ref('')
const errors = ref<{ email?: string }>({})

const router = useRouter()

const handleReset = () => {
  errors.value = {}

  const result = forgotPasswordSchema.safeParse({ email: email.value })

  if (!result.success) {
    const fieldErrors = z.treeifyError(result.error)
    errors.value = {
      email: fieldErrors.properties?.email?.errors?.[0],
    }
    return
  }

  console.log(result)
}
</script>
