<template>
  <section class="flex-1 w-full flex flex-col justify-center items-center gap-2">
    <h1 class="text-3xl font-bold">Reset password</h1>
    <p class="mt-2 text-sm text-slate-600 dark:text-slate-200">
      Enter your new password to complete your reset request.
    </p>

    <p v-if="errors.form" class="mt-4 text-sm text-rose-600 dark:text-rose-400">
      {{ errors.form }}
    </p>

    <form class="mt-8 grid gap-4" @submit.prevent="handleResetPassword">
      <Input
        v-model="password"
        label="New Password"
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
        autocomplete="new-password"
        :error="errors.passwordConfirmation"
        minlength="8"
        required
      />

      <Button type="submit">
        <p v-if="isSubmitting">Resetting...</p>
        <p v-else>Reset Password</p>
      </Button>
    </form>

    <RouterLink class="mt-6 text-sm underline" :to="{ name: 'login' }">Back to login</RouterLink>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { z } from 'zod'
import Input from '@/components/ui/Input.vue'
import Button from '@/components/ui/Button.vue'
import api from '@/lib/axios'
import { toast } from 'vue-sonner'
import { getServerErrorMessage } from '@/lib/authHelpers'

const resetPasswordSchema = z
  .object({
    password: z.string().min(8, 'Password must be at least 8 characters.'),
    passwordConfirmation: z.string().min(1, 'Password confirmation is required.'),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    path: ['passwordConfirmation'],
    message: 'Passwords do not match.',
  })

const resetLinkSchema = z.object({
  email: z.string().trim().email('Invalid reset link email.'),
  token: z.string().trim().min(1, 'Invalid reset token.'),
})

const route = useRoute()
const router = useRouter()

const password = ref('')
const passwordConfirmation = ref('')
const isSubmitting = ref(false)
const errors = ref<{
  form?: string
  password?: string
  passwordConfirmation?: string
}>({})

async function handleResetPassword() {
  errors.value = {}
  isSubmitting.value = true

  const result = resetPasswordSchema.safeParse({
    password: password.value,
    passwordConfirmation: passwordConfirmation.value,
  })

  if (!result.success) {
    const fieldErrors = z.treeifyError(result.error)
    errors.value = {
      password: fieldErrors.properties?.password?.errors?.[0],
      passwordConfirmation: fieldErrors.properties?.passwordConfirmation?.errors?.[0],
    }
    isSubmitting.value = false
    return
  }

  const resetLinkResult = resetLinkSchema.safeParse({
    email: typeof route.query.email === 'string' ? route.query.email : '',
    token: typeof route.query.token === 'string' ? route.query.token : '',
  })

  if (!resetLinkResult.success) {
    errors.value.form = 'This reset link is invalid or incomplete. Request a new one.'
    isSubmitting.value = false
    return
  }

  try {
    await api.post('/auth/reset-password', {
      token: resetLinkResult.data.token,
      email: resetLinkResult.data.email,
      password: result.data.password,
      password_confirmation: result.data.passwordConfirmation,
    })

    toast.success('Password reset successful. Please log in.')
    router.push({ name: 'login' })
  } catch (error) {
    toast.error(getServerErrorMessage(error))
  } finally {
    isSubmitting.value = false
  }
}
</script>
